import { useState, useEffect } from "react";
import { Label } from "../../components/ui/Label";
import { GET_ALL_PAYMENT_METHODS, GET_USER_ADDRESSES } from "../../api/apiService";
import { toast } from "react-toastify";

export default function PaymentMethods({ selectedMethod, onMethodChange }) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([GET_ALL_PAYMENT_METHODS(), GET_USER_ADDRESSES()])
            .then(([paymentResponse, addressResponse]) => {
                setPaymentMethods(paymentResponse.content || []);
                setAddresses(addressResponse.content || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
                toast.error("Không thể tải dữ liệu");
                setLoading(false);
            });
    }, []);

    const getPaymentValue = (methodId) => {
        switch (methodId) {
            case 1:
                return "cod";
            case 2:
                return "momo";
            default:
                return methodId.toString();
        }
    };

    const handlePaymentChange = (e) => {
        onMethodChange(e.target.value);
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="space-y-4">
            <h3>Phương thức thanh toán</h3>
            {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 rounded-md border p-4">
                    <input
                        type="radio"
                        id={`payment-${method.id}`}
                        name="payment"
                        value={getPaymentValue(method.id)}
                        checked={selectedMethod === getPaymentValue(method.id)}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={`payment-${method.id}`} className="flex-1 font-medium">
                        {method.name}
                    </Label>
                </div>
            ))}
        </div>
    );
}