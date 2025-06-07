import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GET_WISHLIST } from "../api/apiService";

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

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 100,
    totalElements: 0,
    totalPages: 0,
    lastPage: false,
  });

  const fetchWishlist = useCallback(
    debounce(async (pageNumber = 0, pageSize = 100) => {
      try {
        console.log(`Fetching wishlist: pageNumber=${pageNumber}, pageSize=${pageSize}`);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setWishlistItems([]);
          setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 0 }));
          return;
        }
        const response = await GET_WISHLIST({ pageNumber, pageSize });
        console.log("Wishlist response:", response);

        setWishlistItems(response.content || []);
        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          lastPage: response.lastPage,
        });
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishlistItems([]);
        setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 0 }));
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        setWishlistItems,
        pagination,
        fetchWishlist,
        totalWishlistItems: pagination.totalElements,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}