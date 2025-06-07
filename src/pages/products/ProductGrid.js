import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import ProductPagination from "./ProductPagination";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { GET_ALL_PRODUCTS, ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../api/apiService";
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

function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key) => obj1[key] === obj2[key]);
}

export default function ProductGrid({ filters, sortBy, sortOrder, onTotalItemsChange }) {
  const { fetchCart } = useCart();
  const { wishlistItems, fetchWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 9,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [lastParams, setLastParams] = useState(null);
  const navigate = useNavigate();

  // Đặt lại pageNumber khi filters thay đổi
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
  }, [filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const fetchProducts = useCallback(
    debounce(async (params) => {
      try {
        setLoading(true);
        const response = await GET_ALL_PRODUCTS(params);
        setProducts(
          response.content.map((item) => ({
            ...item,
          }))
        );
        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements || response.content.length,
          totalPages: response.totalPages,
          lastPage: response.lastPage,
        });
        onTotalItemsChange(response.totalElements || response.content.length);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }, 500),
    [onTotalItemsChange]
  );

  useEffect(() => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null)
    );
    const params = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      sortBy: sortBy || "id",
      sortOrder: sortOrder || "asc",
      ...validFilters,
    };

    // So sánh tham số để tránh gọi API không cần thiết
    if (lastParams && areObjectsEqual(params, lastParams)) {
      console.log("Parameters unchanged, skipping fetch...");
      return;
    }

    setLastParams(params);
    fetchProducts(params);
  }, [pagination.pageNumber, filters, sortBy, sortOrder, fetchProducts, lastParams]);

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, pageNumber: pageNumber - 1 }));
    window.scrollTo({
      top: document.getElementId("product-grid")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    try {
      await ADD_TO_CART({ productId: product.id, quantity: 1 });
      fetchCart();
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleToggleWishlist = async (product) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi thêm vào danh sách yêu thích!");
      navigate("/login");
      return;
    }
    try {
      if (wishlistItems.some((item) => item.productId === product.id)) {
        await REMOVE_FROM_WISHLIST(product.id);
        toast.success(`Đã xóa ${product.name} khỏi danh sách yêu thích`);
      } else {
        await ADD_TO_WISHLIST({ productId: product.id });
        toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
      }
      fetchWishlist();
    } catch (error) {
      toast.error("Không thể cập nhật danh sách yêu thích");
    }
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div id="product-grid">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full text-4xl text-center text-gray-600">Không tìm thấy sản phẩm.</p>
        ) : (
          products.map((product) => {
            const isOutOfStock = !product.availability || (product.quantity === 0);
            return (
              <Card
                key={product.id}
                className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative pt-4">
                  {product.new && (
                    <Badge
                      variant="info"
                      className="absolute left-2 top-2 z-10 rounded-md bg-blue-500 px-2 py-1 text-white shadow-md"
                    >
                      Mới
                    </Badge>
                  )}
                  {product.sale && (
                    <Badge
                      variant="destructive"
                      className="absolute right-2 top-2 z-10 rounded-md bg-red-600 px-2 py-1 text-white shadow-md"
                    >
                      Giảm giá
                    </Badge>
                  )}
                  <Link to={`/product/${product.id}`}>
                    <div className="relative mx-auto h-48 w-48">
                      <img
                        src={`http://localhost:8080/api/products/image/${product.image}`}
                        alt={product.name}
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/images/product-placeholder.jpg";
                        }}
                      />
                    </div>
                  </Link>
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="mb-1 text-base font-semibold hover:text-red-600 md:text-lg">{product.name}</h3>
                  </Link>
                  <p className="mb-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="mb-2 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.review})</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-red-600 md:text-xl">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Add to wishlist"
                    className={
                      wishlistItems.some((item) => item.productId === product.id)
                        ? "border-red-500 hover:border-red-600"
                        : "border-gray-300 hover:border-gray-600"
                    }
                    onClick={() => handleToggleWishlist(product)}
                  >
                    <svg
                      className={
                        wishlistItems.some((item) => item.productId === product.id)
                          ? "fill-red-500 stroke-red-500 h-5 w-5"
                          : "fill-white stroke-gray-500 h-5 w-5 group-hover:fill-gray-600 group-hover:stroke-gray-600"
                      }
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </Button>
                  <Button
                    className="ml-2 flex-1"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? (
                      "Hết hàng"
                    ) : (
                      <>
                        <span className="mr-2">🛒</span> Thêm vào giỏ
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Chỉ hiển thị phân trang nếu totalElements > 9 */}
      {pagination.totalElements > 9 && (
        <ProductPagination
          totalItems={pagination.totalElements}
          itemsPerPage={pagination.pageSize}
          currentPage={pagination.pageNumber + 1}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}