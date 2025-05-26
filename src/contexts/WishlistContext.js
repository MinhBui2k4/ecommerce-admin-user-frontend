import { createContext, useContext, useState, useEffect } from "react";
import { GET_WISHLIST } from "../api/apiService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = async () => {
    try {
      const response = await GET_WISHLIST({ pageNumber: 0, pageSize: 100 });
      setWishlistItems(response.content || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchWishlist();
    }
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistItems, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}