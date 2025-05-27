import { createContext, useContext, useState, useEffect } from "react";
import { GET_WISHLIST } from "../api/apiService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 8,
    totalElements: 0,
    totalPages: 0,
    lastPage: false,
  });

  const fetchWishlist = async (pageNumber = 0, pageSize = 8) => {
    try {
      const response = await GET_WISHLIST({ pageNumber, pageSize });
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
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchWishlist();
    }
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistItems, pagination, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}