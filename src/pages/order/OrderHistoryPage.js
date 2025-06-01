import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GET_USER_ORDERS, GET_ORDERS_BY_STATUS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    ORDERED: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  });
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ORDERED":
        return { border: "1px solid #6B7280", color: "#6B7280" };
      case "CONFIRMED":
        return { border: "1px solid #8B5CF6", color: "#8B5CF6" };
      case "PROCESSING":
        return { border: "1px solid #3B82F6", color: "#3B82F6" };
      case "SHIPPED":
        return { border: "1px solid #F97316", color: "#F97316" };
      case "COMPLETED":
        return { border: "1px solid #10B981", color: "#10B981" };
      case "CANCELLED":
        return { border: "1px solid #EF4444", color: "#EF4444" };
      default:
        return { border: "1px solid #6B7280", color: "#6B7280" };
    }
  };

  // Lấy số lượng đơn hàng cho từng trạng thái
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      navigate("/login");
      return;
    }

    const fetchStatusCounts = async () => {
      try {
        const statuses = ["ORDERED", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
        const params = { page: 0, size: 1 }; // Chỉ lấy 1 kết quả để biết totalElements

        // Gọi API cho từng trạng thái
        const counts = await Promise.all(
          statuses.map(async (status) => {
            const response = await GET_ORDERS_BY_STATUS(status, params);
            return { status, count: response.totalElements || 0 };
          })
        );

        // Gọi API cho "all" (tất cả đơn hàng)
        const allResponse = await GET_USER_ORDERS(params);
        const allCount = allResponse.totalElements || 0;

        // Cập nhật state
        const newCounts = counts.reduce((acc, { status, count }) => {
          acc[status] = count;
          return acc;
        }, { all: allCount });
        setStatusCounts(newCounts);
      } catch (error) {
        console.error("Failed to fetch status counts:", error);
        toast.error("Không thể lấy số lượng đơn hàng");
      }
    };

    fetchStatusCounts();
  }, [navigate]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
  }, [currentTab]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      navigate("/login");
      return;
    }

    setLoading(true);
    const params = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      sort: "orderDate",
      sortOrder: "asc",
    };

    const fetchOrders = currentTab === "all"
      ? GET_USER_ORDERS(params)
      : GET_ORDERS_BY_STATUS(currentTab.toUpperCase(), params);

    fetchOrders
      .then((response) => {
        console.log(`API response for ${currentTab.toUpperCase()}:`, response);
        setOrders(response.content || []);
        setPagination({
          pageNumber: response.pageNumber || 0,
          pageSize: response.pageSize || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 1,
          lastPage: response.lastPage || false,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Failed to fetch orders for status ${currentTab.toUpperCase()}:`, error);
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Không thể tải đơn hàng: ${errorMessage}`);
        setOrders([]);
        setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 1 }));
        setLoading(false);
      });
  }, [currentTab, pagination.pageNumber, navigate]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, pageNumber: pageNumber - 1 }));
    window.scrollTo({
      top: document.getElementById("order-history")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const renderPagination = () => {
    if (pagination.totalElements <= pagination.pageSize) return null;
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
        {pages.map((page) => (
          <button
            key={page}
            style={{
              padding: "8px 12px",
              border: page === pagination.pageNumber + 1 ? "2px solid #3B82F6" : "1px solid #D1D5DB",
              background: page === pagination.pageNumber + 1 ? "#EFF6FF" : "white",
              color: page === pagination.pageNumber + 1 ? "#3B82F6" : "#374151",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "384px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "4px solid #3B82F6",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <div id="order-history" style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <Link to="/profile">
          <button
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              color: "#3B82F6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "20px", marginRight: "8px" }}>←</span> Quay lại
          </button>
        </Link>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>Lịch sử đặt hàng</h1>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "8px",
            background: "#F3F4F6",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          {["all", "ORDERED", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              style={{
                padding: "8px 16px",
                background: currentTab === tab ? "#EF4444" : "white",
                color: currentTab === tab ? "white" : "#374151",
                border: "1px solid #D1D5DB",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={() => setCurrentTab(tab)}
            >
              {tab === "all"
                ? `Tất cả (${statusCounts.all})`
                : tab === "ORDERED"
                ? `Đã đặt (${statusCounts.ORDERED})`
                : tab === "CONFIRMED"
                ? `Đã xác nhận (${statusCounts.CONFIRMED})`
                : tab === "PROCESSING"
                ? `Đang xử lý (${statusCounts.PROCESSING})`
                : tab === "SHIPPED"
                ? `Đang giao (${statusCounts.SHIPPED})`
                : tab === "COMPLETED"
                ? `Hoàn thành (${statusCounts.COMPLETED})`
                : `Đã hủy (${statusCounts.CANCELLED})`}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          padding: "16px",
          background: "white",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          {currentTab === "all"
            ? "Tất cả đơn hàng"
            : currentTab === "ORDERED"
            ? "Đơn hàng đã đặt"
            : currentTab === "CONFIRMED"
            ? "Đơn hàng đã xác nhận"
            : currentTab === "PROCESSING"
            ? "Đơn hàng đang xử lý"
            : currentTab === "SHIPPED"
            ? "Đơn hàng đang giao"
            : currentTab === "COMPLETED"
            ? "Đơn hàng hoàn thành"
            : "Đơn hàng đã hủy"}{" "}
          ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <span style={{ fontSize: "48px" }}>📦</span>
            <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "16px 0 8px" }}>
              Không tìm thấy đơn hàng
            </h3>
            <p style={{ color: "#6B7280" }}>
              {currentTab === "all"
                ? "Bạn chưa có đơn hàng nào."
                : `Không có đơn hàng nào ở trạng thái ${
                    currentTab === "ORDERED"
                      ? "Đã đặt"
                      : currentTab === "CONFIRMED"
                      ? "Đã xác nhận"
                      : currentTab === "PROCESSING"
                      ? "Đang xử lý"
                      : currentTab === "SHIPPED"
                      ? "Đang giao"
                      : currentTab === "COMPLETED"
                      ? "Hoàn thành"
                      : "Đã hủy"
                  }.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  background: "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "500" }}>Đơn hàng #{order.id}</h3>
                      <span
                        style={{
                          ...getStatusStyle(order.status),
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {order.status === "ORDERED"
                          ? "Đã đặt"
                          : order.status === "CONFIRMED"
                          ? "Đã xác nhận"
                          : order.status === "PROCESSING"
                          ? "Đang xử lý"
                          : order.status === "SHIPPED"
                          ? "Đang giao"
                          : order.status === "COMPLETED"
                          ? "Hoàn thành"
                          : "Đã hủy"}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
                      Ngày đặt: {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p style={{ fontSize: "14px", color: "#6B7280" }}>
                      Số lượng: {order.items.length} sản phẩm
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "18px", fontWeight: "bold", color: "#EF4444" }}>
                      {formatPrice(order.total)}
                    </p>
                    <Link to={`/orders/${order.id}`}>
                      <button
                        style={{
                          padding: "8px 16px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "4px",
                          background: "white",
                          color: "#374151",
                          cursor: "pointer",
                          marginTop: "8px",
                        }}
                      >
                        Chi tiết →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {renderPagination()}
    </div>
  );
}