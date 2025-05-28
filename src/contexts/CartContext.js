import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GET_CART } from "../api/apiService";
import { toast } from "react-toastify";

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = useCallback(
        debounce(async () => {
            console.log("fetchCart called with token:", localStorage.getItem("authToken"));
            try {
                const response = await GET_CART();
                console.log("Cart API response:", response);
                setCartItems(response.content[0]?.items || []);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                if (error.response?.status === 401) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                }
            }
        }, 500),
        []
    );

    const getCartTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log("CartContext useEffect, token:", token);
        if (token) {
            fetchCart();
        }
    }, [fetchCart]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}