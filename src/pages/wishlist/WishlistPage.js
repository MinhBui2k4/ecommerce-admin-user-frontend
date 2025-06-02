import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import { useWishlist } from "../../contexts/WishlistContext";
import { ADD_TO_CART, REMOVE_FROM_WISHLIST, GET_PRODUCT_BY_ID } from "../../api/apiService";
import { fetchProductsByIds } from "../../utils/productCache";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";

export default function Wishlist() {
  const { wishlistItems, setWishlistItems, totalWishlistItems } = useWishlist();
  const { fetchCart } = useCart();
  const [detailedItems, setDetailedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch thông tin chi tiết sản phẩm
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (wishlistItems.length === 0) {
        setDetailedItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productIds = wishlistItems.map((item) => item.productId);
        const products = await fetchProductsByIds(productIds, GET_PRODUCT_BY_ID);
        const validProducts = products
          .filter((product) => product !== null)
          .map((product) => {
            const wishlistItem = wishlistItems.find((item) => item.productId === product.id);
            return {
              ...wishlistItem,
              image: product.image,
              description: product.description,
              rating: product.rating || 0,
              oldPrice: product.oldPrice || null,
            };
          });

        console.log("Detailed products:", validProducts);
        setDetailedItems(validProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [wishlistItems]);

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      await REMOVE_FROM_WISHLIST(productId);
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      toast.success(`Đã xóa ${productName} khỏi danh sách yêu thích`);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm khỏi danh sách yêu thích");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await ADD_TO_CART({ productId: item.productId, quantity: 1 });
      await fetchCart();
      toast.success(`Đã thêm ${item.productName} vào giỏ hàng`);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (detailedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Danh sách yêu thích</h2>
        <p className="text-gray-600">Danh sách yêu thích của bạn đang trống.</p>
        <Link to="/products">
          <Button className="mt-4">Khám phá sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 md:text-3xl">
        Danh sách yêu thích ({totalWishlistItems} sản phẩm)
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {detailedItems.map((item) => (
          <Card
            key={item.productId}
            className="overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <div className="relative pt-4">
              <Link to={`/product/${item.productId}`}>
                <div className="relative mx-auto h-48 w-48">
                  <img
                    src={
                      item.image
                        ? `http://localhost:8080/api/products/image/${item.image}`
                        : "/images/product-placeholder.jpg"
                    }
                    alt={item.productName}
                    className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/product-placeholder.jpg";
                    }}
                  />
                </div>
              </Link>
            </div>
            <CardContent className="p-4">
              <Link to={`/product/${item.productId}`}>
                <h3 className="mb-1 text-lg font-semibold hover:text-red-600">{item.productName}</h3>
              </Link>
              <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                {item.description || "Không có mô tả"}
              </p>
              <div className="mb-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(item.rating || 0) ? "text-yellow-400" : "text-gray-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-red-600">{formatPrice(item.productPrice)}</span>
                {item.oldPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatPrice(item.oldPrice)}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleRemoveFromWishlist(item.productId, item.productName)}
                aria-label="Remove from wishlist"
              >
                <span>🗑️</span>
              </Button>
              <Button className="flex-1 ml-2" onClick={() => handleAddToCart(item)}>
                <span className="mr-2">🛒</span> Thêm vào giỏ
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}