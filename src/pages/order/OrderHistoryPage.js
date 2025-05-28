import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { GET_USER_ORDERS, GET_ORDERS_BY_STATUS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentTab, setCurrentTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PROCESSING":
        return <Badge className="border-blue-500 text-blue-500">Đang xử lý</Badge>;
      case "SHIPPED":
        return <Badge className="border-orange-500 text-orange-500">Đang giao</Badge>;
      case "COMPLETED":
        return <Badge className="border-green-500 text-green-500">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge className="border-red-500 text-red-500">Đã hủy</Badge>;
      case "ORDERED":
        return <Badge className="border-gray-500 text-gray-500">Đã đặt</Badge>;
      case "CONFIRMED":
        return <Badge className="border-purple-500 text-purple-500">Đã xác nhận</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      page: 0,
      size: 10,
      sort: "orderDate",
      sortOrder: "asc",
    };
    const fetchOrders = currentTab === "all"
      ? GET_USER_ORDERS(params)
      : GET_ORDERS_BY_STATUS(currentTab.toUpperCase(), params);

    fetchOrders
      .then((response) => {
        setOrders(response.content || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
        toast.error("Không thể tải lịch sử đơn hàng");
        setLoading(false);
      });
  }, [currentTab]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchTerm ? order.id.toString().includes(searchTerm) : true;
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const orderDate = new Date(order.orderDate);
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        matchesDateRange = matchesDateRange && orderDate >= fromDate;
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        matchesDateRange = matchesDateRange && orderDate <= toDate;
      }
    }
    return matchesSearch && matchesDateRange;
  });

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
      <div className="mb-6 flex items-center">
        <Link to="/profile">
          <Button variant="ghost" className="mr-4">
            <span className="mr-2 text-xl">←</span>
            Quay lại
          </Button>
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Lịch sử đặt hàng</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tìm kiếm đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Mã đơn hàng</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2">🔍</span>
                <Input
                  id="search"
                  placeholder="Nhập mã đơn hàng..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-from">Từ ngày</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2">📅</span>
                <Input
                  id="date-from"
                  type="date"
                  className="pl-10"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Đến ngày</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2">📅</span>
                <Input
                  id="date-to"
                  type="date"
                  className="pl-10"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="ordered">Đã đặt</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="shipped">Đang giao</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        {["all", "ordered", "confirmed", "processing", "shipped", "completed", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-xl">📦</span>
                  {tab === "all" ? "Tất cả đơn hàng" :
                   tab === "ordered" ? "Đơn hàng đã đặt" :
                   tab === "confirmed" ? "Đơn hàng đã xác nhận" :
                   tab === "processing" ? "Đơn hàng đang xử lý" :
                   tab === "shipped" ? "Đơn hàng đang giao" :
                   tab === "completed" ? "Đơn hàng hoàn thành" :
                   "Đơn hàng đã hủy"} ({filteredOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="mb-4 text-5xl">📦</span>
                    <h2 className="mb-2 text-xl font-semibold">Không tìm thấy đơn hàng</h2>
                    <p className="text-gray-500">Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center">
                            <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Ngày đặt: {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                          </p>
                          <p className="text-sm text-gray-500">Số lượng: {order.items.length} sản phẩm</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="mb-2 text-lg font-bold text-blue-600">{formatPrice(order.total)}</p>
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center">
                              Chi tiết <span className="ml-1 text-xl">→</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}