import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card,{  CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import { Textarea } from "../../components/ui/Textarea";
import { Separator } from "../../components/ui/Separator";
import { useCart } from "../../contexts/CartContext";
import { GET_USER_ADDRESSES, CREATE_ORDER_FROM_CART, CLEAR_CART } from "../../api/apiService";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import AddressActions from "./AddressActions";
import PaymentMethods from "./PaymentMethods";

export default function CheckoutPage() {
    const { cartItems, getCartTotal, setCartItems } = useCart();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [orderNotes, setOrderNotes] = useState("");
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        if (!price || isNaN(price)) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const subtotal = getCartTotal() || 0;
    const shipping = shippingMethod === "standard" ? 30000 : 60000;
    const total = subtotal + shipping;

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
            navigate("/login");
            return;
        }
        console.log("Calling GET_USER_ADDRESSES with token:", token);
        GET_USER_ADDRESSES({ pageNumber: 0, pageSize: 10 })
            .then((response) => {
                setAddresses(response.content || []);
                const defaultAddress = response.content.find((addr) => addr.isDefault);
                setSelectedAddress(defaultAddress ? defaultAddress.id.toString() : null);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch addresses:", error);
                toast.error("Không thể tải địa chỉ");
                setLoading(false);
            });
    }, [navigate]);

    const handleAddAddress = (newAddress) => {
        setAddresses((prev) =>
            newAddress.isDefault
                ? [newAddress, ...prev.map((addr) => ({ ...addr, isDefault: false }))]
                : [...prev, newAddress]
        );
        if (newAddress.isDefault) {
            setSelectedAddress(newAddress.id.toString());
        }
    };

    const handleUpdateAddress = (updatedAddress) => {
        setAddresses((prev) =>
            updatedAddress.isDefault
                ? prev.map((addr) =>
                      addr.id === updatedAddress.id ? updatedAddress : { ...addr, isDefault: false }
                  )
                : prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
        );
        if (updatedAddress.isDefault) {
            setSelectedAddress(updatedAddress.id.toString());
        }
    };

    const handleDeleteAddress = (id) => {
        const addressToDelete = addresses.find((addr) => addr.id === id);
        if (addressToDelete.isDefault) {
            toast.error("Không thể xóa địa chỉ mặc định");
            return;
        }
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        if (id === selectedAddress) {
            const defaultAddress = addresses.find((addr) => addr.isDefault);
            setSelectedAddress(defaultAddress ? defaultAddress.id.toString() : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (!paymentMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
            navigate("/login");
            return;
        }
        try {
            const order = await CREATE_ORDER_FROM_CART({
                paymentMethodId: paymentMethod === "cod" ? 1 : parseInt(paymentMethod),
                shippingAddressId: parseInt(selectedAddress),
                shippingCost: shipping,
            });
            await CLEAR_CART();
            setCartItems([]);
            toast.success("Đơn hàng đã được đặt thành công!");
            navigate(`/orders/${order.id}`);
        } catch (error) {
            console.error("Order submission error:", error);
            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                navigate("/login");
            } else {
                toast.error("Không thể đặt đơn hàng");
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">Thanh toán</h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <Card className="mb-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center">
                                    <span className="mr-2 text-xl">📍</span> Địa chỉ giao hàng
                                </CardTitle>
                                <AddressForm onAddAddress={handleAddAddress} />
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedAddress}
                                    onValueChange={setSelectedAddress}
                                    className="space-y-4"
                                >
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="flex items-start space-x-2 rounded-md border p-4"
                                        >
                                            <RadioGroupItem
                                                value={address.id.toString()}
                                                id={`address-${address.id}`}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor={`address-${address.id}`}
                                                        className="font-medium"
                                                    >
                                                        {address.name}
                                                    </Label>
                                                    <AddressActions
                                                        address={address}
                                                        onEdit={handleUpdateAddress}
                                                        onDelete={handleDeleteAddress}
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-500">{address.phone}</p>
                                                <p className="text-sm text-gray-500">
                                                    {`${address.address}, ${address.ward}, ${address.district}, ${address.province}`}
                                                </p>
                                                <div className="mt-2 flex space-x-2">
                                                    {address.isDefault && (
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                            Mặc định
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                                        {address.type === "home" ? "Nhà riêng" : "Văn phòng"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2 text-xl">🚚</span> Phương thức vận chuyển
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={shippingMethod}
                                    onValueChange={setShippingMethod}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between rounded-md border p-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="standard" id="shipping-standard" />
                                            <Label htmlFor="shipping-standard" className="font-medium">
                                                Giao hàng tiêu chuẩn
                                            </Label>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatPrice(30000)}</p>
                                            <p className="text-sm text-gray-500">3-5 ngày</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-md border p-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="express" id="shipping-express" />
                                            <Label htmlFor="shipping-express" className="font-medium">
                                                Giao hàng nhanh
                                            </Label>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatPrice(60000)}</p>
                                            <p className="text-sm text-gray-500">1-2 ngày</p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2 text-xl">💳</span> Phương thức thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PaymentMethods
                                    selectedMethod={paymentMethod}
                                    onMethodChange={setPaymentMethod}
                                />
                            </CardContent>
                        </Card>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Ghi chú đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                    className="min-h-[100px]"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </form>
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Tóm tắt đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                            {/* <img
                                                src={
                                                    item.image
                                                        ? `http://localhost:8080/api/products/image/${item.image}`
                                                        : "/images/product-placeholder.jpg"
                                                }
                                                alt={item.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.target.src = "/images/product-placeholder.jpg";
                                                }}
                                            /> */}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {formatPrice((item.price || 0) * (item.quantity || 0))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-sm">Tạm tính</p>
                                    <p className="font-medium">{formatPrice(subtotal)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Phí vận chuyển</p>
                                    <p className="font-medium">{formatPrice(shipping)}</p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between">
                                <p className="text-base font-medium">Tổng cộng</p>
                                <p className="text-lg font-bold text-blue-600">{formatPrice(total)}</p>
                            </div>
                            <div className="mt-6">
                                <Button  className="w-full px-8 py-3" size="lg" onClick={handleSubmit}>
                                    Đặt hàng
                                </Button>
                                <p className="mt-2 text-center text-xs text-gray-500">
                                    Bằng cách đặt hàng, bạn đồng ý với{" "}
                                    <Link to="/terms" className="text-blue-600 hover:underline">
                                        Điều khoản dịch vụ
                                    </Link>{" "}
                                    và{" "}
                                    <Link to="/privacy" className="text-blue-600 hover:underline">
                                        Chính sách bảo mật
                                    </Link>
                                    .
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}