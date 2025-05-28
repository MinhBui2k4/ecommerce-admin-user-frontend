import { useState, useEffect } from "react";
import { Label } from "../../components/ui/Label";  
import { Input } from "../../components/ui/Input";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import { Separator } from "../../components/ui/Separator";
import { Button } from "../../components/ui/Button";
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

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2 rounded-md border p-4">
            <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
            <Label htmlFor={`payment-${method.id}`} className="flex-1 font-medium">
              {method.name}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="cod" id="payment-cod" />
          <Label htmlFor="payment-cod" className="flex-1 font-medium">
            Thanh toán khi nhận hàng (COD)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}