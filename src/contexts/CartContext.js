import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GET_CART, GET_PRODUCT_BY_ID } from "../api/apiService";
import { fetchProductsByIds } from "../utils/productCache";
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(
    debounce(async () => {
      let isMounted = true;

      console.log("fetchCart called with token:", localStorage.getItem("authToken"));
      try {
        setLoading(true);
        const response = await GET_CART();
        const items = response.content[0]?.items || [];

        if (isMounted) {
          setCartItems(items);

          if (items.length > 0) {
            const productIds = items.map((item) => item.productId);
            const products = await fetchProductsByIds(productIds, GET_PRODUCT_BY_ID);
            const validProducts = products
              .filter((product) => product !== null)
              .map((product) => {
                const cartItem = items.find((item) => item.productId === product.id);
                return {
                  ...cartItem,
                  productImage: product.image,
                  isAvailable: product.availability,
                };
              });
            setDetailedItems(validProducts);
          } else {
            setDetailedItems([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (isMounted) {
          if (error.response?.status === 401) {
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          } else {
            toast.error("Không thể tải giỏ hàng.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }

      return () => {
        isMounted = false;
      };
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
        setDetailedItems,
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