import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { GET_CART, CLEAR_CART } from "../api/apiService";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await GET_CART();
            setCart(response.content[0]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Failed to load cart");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleClearCart = async () => {
        try {
            await CLEAR_CART();
            setCart({ items: [] });
            alert("Cart cleared!");
        } catch (error) {
            alert("Failed to clear cart");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!cart || !cart.items) return <p>Cart is empty</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {cart.items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.items.map((item) => (
                        <CartItem key={item.id} item={item} onUpdate={fetchCart} />
                    ))}
                    <div className="mt-6 flex justify-between">
                        <p className="text-xl font-semibold">Total: ${cart.totalCartPrice}</p>
                        <button onClick={handleClearCart} className="bg-red-500 text-white px-6 py-2 rounded">
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}