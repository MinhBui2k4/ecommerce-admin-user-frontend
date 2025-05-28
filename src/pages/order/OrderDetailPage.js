import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Separator } from "../../components/ui/Separator";
import { GET_ORDER_BY_ID, GET_PAYMENT_METHOD, GET_ADDRESS, CANCEL_ORDER } from "../../api/apiService";
import { toast } from "react-toastify";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PROCESSING":
        return <Badge variant="processing">Đang xử lý</Badge>;
      case "SHIPPED":
        return <Badge variant="shipped">Đang giao</Badge>;
      case "DELIVERED":
        return <Badge className="border-green-500 text-green-500">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge className="border-red-500 text-red-500">Đã hủy</Badge>;
      default:
        return <Badge>Đặt hàng</Badge>;
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GET_ORDER_BY_ID(orderId),
      GET_PAYMENT_METHOD(1), // Assuming paymentMethodId=1 for simplicity
      GET_ADDRESS(1), // Assuming shippingAddressId=1
    ])
      .then(([orderData, paymentData, addressData]) => {
        setOrder(orderData);
        setPaymentMethod(paymentData);
        setShippingAddress(addressData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch order details:", error);
        toast.error("Không thể tải chi tiết đơn hàng");
        setLoading(false);
      });
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      await CANCEL_ORDER(orderId);
      setOrder((prev) => ({
        ...prev,
        status: "CANCELLED",
        timeline: [
          ...prev.timeline,
          {
            id: Date.now(),
            status: "CANCELLED",
            date: new Date().toISOString(),
            description: "Đơn hàng đã bị hủy bởi người dùng",
          },
        ],
      }));
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error("Không thể hủy đơn hàng");
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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Đơn hàng không tồn tại</h2>
          <p className="mb-6 text-gray-600">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/orders">
            <Button>Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/orders">
            <Button variant="ghost" className="mr-4">
              <span className="mr-2 text-xl">←</span>
              Quay lại
            </Button>
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl">Chi tiết đơn hàng #{order.id}</h1>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2 text-xl">📦</span>
                Trạng thái đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {order.timeline.map((event, index) => (
                    <div key={event.id} className="relative flex items-start">
                      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <div className="ml-10">
                        <h3 className="font-medium">{event.description}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8080/api/products/image/${item.productId}.webp`}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                        onError={(e) => { e.target.src = "/images/product-placeholder.jpg"; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2 text-xl">🚚</span>
                Thông tin giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Địa chỉ giao hàng</h3>
                  <div className="mt-2 flex items-start">
                    <span className="mr-2 text-xl text-gray-500">📍</span>
                    <div>
                      <p className="font-medium">{shippingAddress?.name}</p>
                      <p className="text-sm text-gray-500">{shippingAddress?.phone}</p>
                      <p className="text-sm text-gray-500">
                        {`${shippingAddress?.address}, ${shippingAddress?.ward}, ${shippingAddress?.district}, ${shippingAddress?.province}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm">Ngày đặt hàng</p>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Mã đơn hàng</p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Phương thức thanh toán</p>
                  <div className="flex items-center">
                    <span className="mr-1 text-xl text-gray-500">💳</span>
                    <p className="font-medium">{paymentMethod?.name}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Tạm tính</p>
                    <p className="font-medium">{formatPrice(order.total - order.shippingCost)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Phí vận chuyển</p>
                    <p className="font-medium">{formatPrice(order.shippingCost)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <p className="text-base font-medium">Tổng cộng</p>
                  <p className="text-lg font-bold text-blue-600">{formatPrice(order.total)}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <Button className="w-full" variant="outline">
                    Liên hệ hỗ trợ
                  </Button>
                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={handleCancelOrder}
                    >
                      <span className="mr-2 text-xl">⚠️</span>
                      Hủy đơn hàng
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}