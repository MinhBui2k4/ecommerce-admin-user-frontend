import { useState, useEffect } from "react";
import { Label } from "../../components/ui/Label";
import { GET_ALL_PAYMENT_METHODS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function PaymentMethods({ selectedMethod, onMethodChange }) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GET_ALL_PAYMENT_METHODS()
            .then((response) => {
                setPaymentMethods(response.content || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch payment methods:", error);
                toast.error("Không thể tải phương thức thanh toán");
                setLoading(false);
            });
    }, []);

    const handlePaymentChange = (e) => {
        onMethodChange(e.target.value);
    };

    if (loading) return <p>Đang tải...</p>;
    if (paymentMethods.length === 0 && selectedMethod !== "cod")
        return <p>Không có phương thức thanh toán nào khả dụng.</p>;

    return (
        <div className="space-y-4">
            {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 rounded-md border p-4">
                    <input
                        type="radio"
                        id={`payment-${method.id}`}
                        name="payment"
                        value={method.id.toString()}
                        checked={selectedMethod === method.id.toString()}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={`payment-${method.id}`} className="flex-1 font-medium">
                        {method.name}
                    </Label>
                </div>
            ))}
            <div className="flex items-center space-x-2 rounded-md border p-4">
                <input
                    type="radio"
                    id="payment-cod"
                    name="payment"
                    value="cod"
                    checked={selectedMethod === "cod"}
                    onChange={handlePaymentChange}
                    className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor="payment-cod" className="flex-1 font-medium">
                    Thanh toán khi nhận hàng (COD)
                </Label>
            </div>
        </div>
    );
}