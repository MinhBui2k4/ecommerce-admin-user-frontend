import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GET_WISHLIST } from "../api/apiService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 1000, // Đặt mặc định pageSize lớn để lấy tất cả
    totalElements: 0,
    totalPages: 0,
    lastPage: false,
  });

  const fetchWishlist = useCallback(async (pageNumber = 0, pageSize = 1000) => {
    try {
      console.log(`Fetching wishlist: pageNumber=${pageNumber}, pageSize=${pageSize}`);
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchWishlist();
    }
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, pagination, fetchWishlist, totalWishlistItems: pagination.totalElements }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}