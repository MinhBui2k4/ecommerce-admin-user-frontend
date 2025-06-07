import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Separator } from "../../components/ui/Separator";
import { Badge } from "../../components/ui/Badge";
import Card, { CardContent } from "../../components/ui/Card";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { GET_PRODUCT_BY_ID, GET_ALL_PRODUCTS, ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../api/apiService";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { wishlistItems, fetchWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscountPercentage = (price, oldPrice) => {
    if (!oldPrice) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GET_PRODUCT_BY_ID(id),
      GET_PRODUCT_BY_ID(id).then((productData) =>
        GET_ALL_PRODUCTS({ brandId: productData.brandId, pageNumber: 0, pageSize: 5 })
      ),
    ])
      .then(([productData, relatedProductsData]) => {
        console.log("Product data:", productData);
        console.log("Related products data:", relatedProductsData);
        setProduct({
          ...productData,
          sku: productData.sku || `P-${productData.id}`,
          availability: productData.availability ? "Còn hàng" : "Hết hàng",
          maxQuantity: productData.quantity,
          images: [productData.image, ...(productData.images || [])],
          description_long: productData.description,
        });
        setRelatedProducts(
          relatedProductsData.content
            .filter((item) => item.id !== parseInt(id))
            .slice(0, 4)
            .map((item) => ({
              ...item,
            }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (value) => {
    if (product && value >= 1 && value <= product.maxQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    try {
      await ADD_TO_CART({ productId: product.id, quantity });
      fetchCart();
      toast.success(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng`);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
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
      fetchWishlist(0, 1000);
    } catch (error) {
      toast.error("Không thể cập nhật danh sách yêu thích");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi mua hàng!");
      navigate("/login");
      return;
    }
    await handleAddToCart();
    navigate("/cart");
  };

  const getImageUrl = (image, isPrimary = false) => {
    const endpoint = isPrimary ? "image" : "images";
    return `http://localhost:8080/api/products/${endpoint}/${image}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Sản phẩm không tồn tại</h2>
          <p className="mb-6 text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/products">
            <Button>Quay lại trang sản phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.availability !== "Còn hàng" || product.maxQuantity === 0; // Kiểm tra availability và maxQuantity

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Images */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg border bg-white">
            <img
              src={getImageUrl(product.images[selectedImage], selectedImage === 0)}
              alt={product.name}
              className="object-contain p-4 w-full h-full"
              onError={(e) => {
                console.error(`Failed to load image: ${product.images[selectedImage]}`);
                e.target.src = "/images/product-placeholder.jpg";
              }}
            />
            {product.new && <Badge variant="info" className="absolute left-4 top-4 px-3 py-2 text-base">Mới</Badge>}
            {product.sale && (
              <Badge variant="destructive" className="absolute right-4 top-4 px-3 py-2 text-base">
                -{calculateDiscountPercentage(product.price, product.oldPrice)}%
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square overflow-hidden rounded-md border ${
                  selectedImage === index ? "border-blue-600" : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={getImageUrl(image, index === 0)}
                  alt={`${product.name} - Ảnh ${index + 1}`}
                  className="object-contain p-2 w-full h-full"
                  onError={(e) => {
                    console.error(`Failed to load thumbnail: ${image}`);
                    e.target.src = "/images/product-placeholder.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">{product.name}</h1>

          <div className="mb-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm text-gray-600">({product.rating} - {product.review || 0} đánh giá)</span>
            </div>
            <Separator orientation="vertical" className="mx-4 h-5" />
            <span className="text-sm text-gray-600">SKU: {product.sku}</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-600 md:text-3xl">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
              )}
              {product.oldPrice && (
                <Badge variant="destructive" className="ml-5">
                  Tiết kiệm {formatPrice(product.oldPrice - product.price)}
                </Badge>
              )}
            </div>
            <p className={`mt-1 text-sm ${product.availability === "Còn hàng" ? "text-green-600" : "text-red-600"}`}>
              Tình trạng: <span className="font-semibold">{product.availability}</span>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 line-clamp-2">{product.description}</p>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold">Số lượng</h3>
            <div className="flex items-center">
              <Button
                variant="blue"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <span>-</span>
              </Button>
              <input
                type="number"
                min="1"
                max={product.maxQuantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="h-10 w-16 border-x-0 border-y text-center"
              />
              <Button
                variant="blue"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.maxQuantity}
              >
                <span>+</span>
              </Button>
              <span className="ml-4 text-sm text-gray-500">Còn {product.maxQuantity} sản phẩm</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
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
            <Button
              className="flex-1"
              variant="blue"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Hết hàng" : "Mua ngay"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 ${
                wishlistItems.some((item) => item.productId === product.id)
                  ? "border-red-500 hover:border-red-600"
                  : "border-gray-300 hover:border-gray-600"
              }`}
              onClick={handleToggleWishlist}
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
          </div>

          {/* Benefits */}
          <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-start">
              <span className="mr-3 text-xl text-blue-600">🚚</span>
              <div>
                <p className="font-semibold">Giao hàng miễn phí</p>
                <p className="text-sm text-gray-600">Cho đơn hàng từ 500.000đ</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-xl text-blue-600">🛡️</span>
              <div>
                <p className="font-semibold">Bảo hành</p>
                <p className="text-sm text-gray-600">12 tháng bảo hành toàn quốc</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-xl text-blue-600">🔄</span>
              <div>
                <p className="font-semibold">Đổi trả dễ dàng</p>
                <p className="text-sm text-gray-600">7 ngày đổi trả miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <p className="text-gray-600">{product.description_long}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold md:text-2xl">Sản phẩm liên quan</h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-600">Không có sản phẩm liên quan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
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
                        src={getImageUrl(product.image, true)}
                        alt={product.name}
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          console.error(`Failed to load related product image: ${product.image}`);
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}