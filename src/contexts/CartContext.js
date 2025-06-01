import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GET_CART, GET_PRODUCT_BY_ID } from "../api/apiService";
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
    const [detailedItems, setDetailedItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // Thêm trạng thái selectedItems
    const [loading, setLoading] = useState(true);

    const fetchCart = useCallback(
        debounce(async () => {
            console.log("fetchCart called with token:", localStorage.getItem("authToken"));
            try {
                setLoading(true);
                const response = await GET_CART();
                const items = response.content[0]?.items || [];
                setCartItems(items);

                // Fetch chi tiết sản phẩm
                if (items.length > 0) {
                    const productPromises = items.map((item) =>
                        GET_PRODUCT_BY_ID(item.productId).catch((error) => {
                            console.error(`Error fetching product ${item.productId}:`, error);
                            return null;
                        })
                    );
                    const products = await Promise.all(productPromises);
                    const validProducts = products
                        .filter((product) => product !== null)
                        .map((product, index) => ({
                            ...items[index],
                            productImage: product.image,
                            isAvailable: product.availability,
                        }));
                    setDetailedItems(validProducts);
                } else {
                    setDetailedItems([]);
                }
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                if (error.response?.status === 401) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    toast.error("Không thể tải giỏ hàng.");
                }
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const getCartTotal = () => {
        return selectedItems.length > 0
            ? cartItems
                  .filter((item) => selectedItems.includes(item.id))
                  .reduce((sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0), 0)
            : 0;
    };

    const clearSelectedItems = () => {
        setSelectedItems([]);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log("CartContext useEffect, token:", token);
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [fetchCart]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                fetchCart,
                getCartTotal,
                detailedItems,
                loading,
                selectedItems,
                setSelectedItems,
                clearSelectedItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}