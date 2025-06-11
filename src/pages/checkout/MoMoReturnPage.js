import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function MoMoReturnPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const resultCode = searchParams.get("resultCode");
        const orderId = searchParams.get("orderId");
        const originalOrderId = localStorage.getItem("momoOriginalOrderId");

        if (resultCode === "0") {
            // toast.success("Thanh toán MoMo thành công!");
            navigate(`/orders/${originalOrderId}`); // Điều hướng đến orderId gốc
            localStorage.removeItem("momoOriginalOrderId"); // Xóa sau khi sử dụng
        } else {
            toast.error("Thanh toán MoMo thất bại. Vui lòng thử lại.");
            navigate("/checkout");
        }
    }, [navigate, searchParams]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="ml-4">Đang xử lý thanh toán...</p>
            </div>
        </div>
    );
}