import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GET_ORDER_BY_ID, GET_ALL_PAYMENT_METHODS, GET_SHIPPING_ADDRESS, CANCEL_ORDER, GET_PRODUCT_BY_ID } from "../../api/apiService";
import { toast } from "react-toastify";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [productImages, setProductImages] = useState({}); // Lưu productImage theo productId
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem chi tiết đơn hàng");
      navigate("/login");
      return;
    }

    console.log("orderId from useParams:", orderId);
    if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
      toast.error("Mã đơn hàng không hợp lệ");
      setLoading(false);
      navigate("/orders");
      return;
    }

    setLoading(true);
    GET_ORDER_BY_ID(orderId)
      .then((orderData) => {
        console.log("Order data:", orderData);
        if (!orderData || !orderData.id) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ");
        }
        setOrder(orderData);

        // Lấy productImage cho từng sản phẩm
        const productPromises = orderData.items.map((item) =>
          GET_PRODUCT_BY_ID(item.productId)
            .then((product) => ({
              productId: item.productId,
              image: product.image || null, // Giả sử API trả về trường image
            }))
            .catch((error) => {
              console.error(`Failed to fetch product ${item.productId}:`, error);
              return { productId: item.productId, image: null };
            })
        );

        return Promise.all([
          GET_ALL_PAYMENT_METHODS()
            .then((response) => {
              console.log("Payment methods:", response);
              const method = response.content?.find((m) => m.id === orderData.paymentMethodId);
              return method || null;
            })
            .catch((error) => {
              console.error("Failed to fetch payment methods:", error);
              return null;
            }),
          orderData.shippingAddressId
            ? GET_SHIPPING_ADDRESS(orderData.shippingAddressId)
              .then((addressData) => {
                console.log("Shipping address:", addressData);
                return addressData;
              })
              .catch((error) => {
                console.error("Failed to fetch shipping address:", error);
                return null;
              })
            : Promise.resolve(null),
          Promise.all(productPromises).then((images) => {
            const imageMap = images.reduce((acc, { productId, image }) => {
              acc[productId] = image;
              return acc;
            }, {});
            return imageMap;
          }),
        ]);
      })
      .then(([paymentData, addressData, imageMap]) => {
        setPaymentMethod(paymentData);
        setShippingAddress(addressData);
        setProductImages(imageMap);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch order details:", error);
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Không thể tải chi tiết đơn hàng: ${errorMessage}`);
        setOrder(null);
        setLoading(false);
        navigate("/orders");
      });
  }, [orderId, navigate]);

  const handleCancelOrder = async () => {
    try {
      await CANCEL_ORDER(orderId);
      setOrder((prev) => ({ ...prev, status: "CANCELLED" }));
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Không thể hủy đơn hàng: ${errorMessage}`);
    }
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

  if (!order) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Đơn hàng không tồn tại
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "24px" }}>
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/orders">
            <button
              style={{
                padding: "8px 16px",
                background: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Quay lại danh sách đơn hàng
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/orders">
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
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "16px" }}>
            Chi tiết đơn hàng #{order.id}
          </h1>
        </div>
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

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div>
          <div
            style={{
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "16px",
              background: "white",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
              Trạng thái đơn hàng
            </h2>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "0",
                  height: "100%",
                  width: "2px",
                  background: "#E5E7EB",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {order.timeline?.map((event, index) => (
                  <div key={event.id} style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        width: "24px",
                        height: "24px",
                        background: "#3B82F6",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ marginLeft: "40px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "500" }}>{event.description}</h3>
                      <p style={{ fontSize: "14px", color: "#6B7280" }}>
                        {new Date(event.date).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "16px",
              background: "white",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Sản phẩm</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "64px", height: "64px", overflow: "hidden", borderRadius: "8px" }}>
                    <img
                      src={
                        productImages[item.productId]
                          ? `http://localhost:8080/api/products/image/${productImages[item.productId]}`
                          : "/images/product-placeholder.jpg"
                      }
                      alt={item.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/images/product-placeholder.jpg";
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "20px", fontWeight: "500" }}>{item.productName}</h3>
                    <p style={{ fontSize: "14px", color: "#6B7280" }}>SL: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
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
              Thông tin giao hàng
            </h2>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "500" }}>Địa chỉ giao hàng</h3>
              {shippingAddress ? (
                <div style={{ display: "flex", alignItems: "flex-start", marginTop: "8px" }}>
                  <span style={{ fontSize: "20px", color: "#6B7280", marginRight: "8px" }}>📍</span>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>{shippingAddress.name}</p>
                    <p style={{ fontSize: "14px", color: "#6B7280" }}>{shippingAddress.phone}</p>
                    <p style={{ fontSize: "14px", color: "#6B7280" }}>
                      {`${shippingAddress.address}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}`}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#6B7280" }}>Không có thông tin địa chỉ</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "16px",
              background: "white",
              position: "sticky",
              top: "80px",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
              Tóm tắt đơn hàng
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "14px" }}>Ngày đặt hàng</p>
                <p style={{ fontSize: "14px", fontWeight: "500" }}>
                  {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "14px" }}>Mã đơn hàng</p>
                <p style={{ fontSize: "14px", fontWeight: "500" }}>#{order.id}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "14px" }}>Phương thức thanh toán</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "20px", color: "#6B7280", marginRight: "4px" }}>💳</span>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    {paymentMethod?.name || "Không xác định"}
                  </p>
                </div>
              </div>

              <div style={{ height: "1px", background: "#D1D5DB" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "14px" }}>Tạm tính</p>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    {formatPrice(order.total - order.shippingCost)}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "14px" }}>Phí vận chuyển</p>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    {formatPrice(order.shippingCost)}
                  </p>
                </div>
              </div>

              <div style={{ height: "1px", background: "#D1D5DB" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "16px", fontWeight: "500" }}>Tổng cộng</p>
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#3B82F6" }}>
                  {formatPrice(order.total)}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    background: "white",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Liên hệ hỗ trợ
                </button>
                {["ORDERED", "CONFIRMED"].includes(order.status) && (
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleCancelOrder}
                  >
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>⚠️</span>
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}