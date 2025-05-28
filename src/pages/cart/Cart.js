import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";
import { GET_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from "../../api/apiService";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import { Label } from "../../components/ui/Label";
import { Separator } from "../../components/ui/Separator";

// Sample coupon codes (replace with backend API if needed)
const validCoupons = [
  { code: "WELCOME10", discount: 0.1, type: "percentage" },
  { code: "FREESHIP", discount: 30000, type: "fixed" },
  { code: "BLACKFRIDAY", discount: 0.3, type: "percentage" },
];

export default function Cart() {
  const { cartItems, setCartItems, getCartTotal, fetchCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    console.log("Cart.js useEffect running"); // For debugging
    const fetchData = async () => {
      try {
        await fetchCart();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Không thể tải giỏ hàng");
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCart]);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleItemSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
    setSelectAll(selectedItems.length + 1 === cartItems.length);
  };

  const handleRemoveItem = async (id, name) => {
    try {
      await REMOVE_FROM_CART(id);
      await fetchCart();
      toast.info(`Đã xóa ${name} khỏi giỏ hàng`);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
      setSelectAll(true);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      for (const id of selectedItems) {
        await REMOVE_FROM_CART(id);
        const item = cartItems.find((item) => item.id === id);
        toast.info(`Đã xóa ${item.productName} khỏi giỏ hàng`);
      }
      await fetchCart();
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error removing selected items:", error);
      toast.error("Không thể xóa các sản phẩm đã chọn");
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await UPDATE_CART_ITEM(id, { quantity });
      await fetchCart();
      toast.success("Đã cập nhật số lượng");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Không thể cập nhật số lượng");
    }
  };

  const applyCoupon = () => {
    const coupon = validCoupons.find((c) => c.code === couponCode);
    if (!coupon) {
      setCouponError("Mã giảm giá không hợp lệ");
      setAppliedCoupon(null);
      return;
    }
    setCouponError("");
    setAppliedCoupon(coupon);
    toast.success(`Mã ${coupon.code} đã được áp dụng`);
  };

  const clearCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleShippingChange = (method) => {
    setShippingMethod(method);
  };

  const handleClearCart = async () => {
    try {
      await CLEAR_CART();
      await fetchCart();
      setSelectedItems([]);
      setSelectAll(false);
      toast.info("Đã xóa toàn bộ giỏ hàng");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Không thể xóa giỏ hàng");
    }
  };

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === "standard" ? 30000 : 60000;
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount
    : 0;
  const total = subtotal + shippingCost - discount;

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <span className="text-red-600">🛒</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Giỏ hàng trống</h2>
          <p className="mb-6 text-gray-500">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products">
            <Button>
              <span className="mr-2">🛍️</span> Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">🛒</span> Sản phẩm trong giỏ hàng (
                    {cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                    <Label htmlFor="select-all">Chọn tất cả</Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col space-y-3 border-b pb-6 sm:flex-row sm:space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleItemSelect(item.id)}
                        />
                        <div className="relative h-24 w-24 overflow-hidden rounded-md">
                          {/* <img
                            src={
                              item.productImage
                                ? `http://localhost:8080/api/products/image/${item.productImage}`
                                : "/images/product-placeholder.jpg"
                            }
                            alt={item.productName}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.src = "/images/product-placeholder.jpg";
                            }}
                          /> */}
                        </div>
                        <div className="flex-1">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-medium hover:text-blue-600">{item.productName}</h3>
                          </Link>
                          <p className="mt-1 font-medium text-blue-600">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:ml-6 sm:flex-col sm:items-end">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <span>-</span>
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)
                            }
                            className="h-8 w-12 rounded-none border-x-0 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <span>+</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleRemoveItem(item.id, item.productName)}
                          >
                            <span>🗑️</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to="/products">
                  <Button variant="outline">Tiếp tục mua sắm</Button>
                </Link>
                <div className="flex space-x-2">
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleRemoveSelected}
                    disabled={selectedItems.length === 0}
                  >
                    Xóa đã chọn
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleClearCart}
                  >
                    Xóa giỏ hàng
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="coupon" className="text-sm font-medium">
                    Mã giảm giá
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="coupon"
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={applyCoupon} disabled={!couponCode}>
                      Áp dụng
                    </Button>
                  </div>
                  {couponError && <p className="text-sm text-red-500">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between rounded-md bg-green-50 p-2 text-green-700">
                      <span>
                        Đã áp dụng: <strong>{appliedCoupon.code}</strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-green-700 hover:bg-transparent hover:text-green-800"
                        onClick={clearCoupon}
                      >
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phương thức vận chuyển</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="shipping-standard"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === "standard"}
                          onChange={() => handleShippingChange("standard")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="shipping-standard" className="text-sm">
                          Giao hàng tiêu chuẩn (3-5 ngày)
                        </Label>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(30000)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="shipping-express"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === "express"}
                          onChange={() => handleShippingChange("express")}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="shipping-express" className="text-sm">
                          Giao hàng nhanh (1-2 ngày)
                        </Label>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(60000)}</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tạm tính</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Phí vận chuyển</span>
                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Giảm giá</span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <span className="text-base font-medium">Tổng cộng</span>
                  <span className="text-lg font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
                <Link to="/checkout" className="block w-full">
                  <Button className="w-full px-8 py-3" size="lg">
                    Tiến hành thanh toán <span className="ml-2">➡️</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}