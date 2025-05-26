// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "../../components/ui/Button";
// import { Card, CardContent, CardFooter } from "../../components/ui/Card";
// import { Badge } from "../../components/ui/Badge";
// import { useCart } from "../../contexts/CartContext";
// import { useWishlist } from "../../contexts/WishlistContext";
// import { GET_ALL_PRODUCTS, ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../api/apiService";
// import { toast } from "react-toastify";

// export default function FeaturedProducts() {
//   const { fetchCart } = useCart();
//   const { wishlistItems, fetchWishlist } = useWishlist();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     GET_ALL_PRODUCTS({ pageNumber: 0, pageSize: 8 })
//       .then((response) => {
//         setProducts(response.content);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch products:", error);
//         setLoading(false);
//         toast.error("Không thể tải sản phẩm");
//       });
//   }, []);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const handleAddToCart = async (product) => {
//     try {
//       await ADD_TO_CART({ productId: product.id, quantity: 1 });
//       fetchCart();
//       toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
//     } catch (error) {
//       toast.error("Không thể thêm vào giỏ hàng");
//     }
//   };

//   const handleToggleWishlist = async (product) => {
//     try {
//       if (wishlistItems.some((item) => item.productId === product.id)) {
//         await REMOVE_FROM_WISHLIST(product.id);
//         toast.info(`Đã xóa ${product.name} khỏi danh sách yêu thích`);
//       } else {
//         await ADD_TO_WISHLIST({ productId: product.id });
//         toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
//       }
//       fetchWishlist();
//     } catch (error) {
//       toast.error("Không thể cập nhật danh sách yêu thích");
//     }
//   };

//   if (loading) return <p className="text-center py-8">Đang tải...</p>;

//   return (
//     <section className="container mx-auto px-4 py-8">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-bold md:text-3xl">Sản phẩm nổi bật</h2>
//         <Link to="/products">
//           <Button variant="outline">Xem tất cả</Button>
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product) => (
//           <Card
//             key={product.id}
//             className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//           >
//             <div className="relative pt-4">
//               {product.new && (
//                 <Badge className="absolute left-4 top-4 bg-blue-500 hover:bg-blue-600">New</Badge>
//               )}
//               {product.sale && (
//                 <Badge className="absolute right-4 top-4 bg-red-500 hover:bg-red-600">Sale</Badge>
//               )}
//               <Link to={`/product/${product.id}`}>
//                 <div className="relative mx-auto h-48 w-48">
//                   <img
//                     src={`http://localhost:8080/api/products/image/${product.image}`}
//                     alt={product.name}
//                     className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
//                     onError={(e) => {
//                       e.target.src = "/images/product-placeholder.jpg";
//                     }}
//                   />
//                 </div>
//               </Link>
//             </div>
//             <CardContent className="p-4">
//               <Link to={`/product/${product.id}`}>
//                 <h3 className="mb-1 text-base font-semibold hover:text-blue-600 md:text-lg">{product.name}</h3>
//               </Link>
//               <p className="mb-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
//               <div className="mb-2 flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <span
//                     key={i}
//                     className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}`}
//                   >
//                     ★
//                   </span>
//                 ))}
//                 <span className="ml-2 text-sm text-gray-600">({product.rating || 0})</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-lg font-bold text-blue-600 md:text-xl">{formatPrice(product.price)}</span>
//                 {product.oldPrice && (
//                   <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
//                 )}
//               </div>
//               <p className={`mt-2 text-sm ${product.availability ? "text-green-600" : "text-red-600"}`}>
//                 {product.availability ? "Còn hàng" : "Hết hàng"}
//               </p>
//             </CardContent>
//             <CardFooter className="flex justify-between p-4 pt-0">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 aria-label="Add to wishlist"
//                 className={
//                   wishlistItems.some((item) => item.productId === product.id)
//                     ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
//                     : "text-gray-500 border-gray-300 hover:text-gray-600 hover:border-gray-600"
//                 }
//                 onClick={() => handleToggleWishlist(product)}
//               >
//                 <span
//                   className={
//                     wishlistItems.some((item) => item.productId === product.id) ? "text-red-500" : "text-gray-500"
//                   }
//                 >
//                   ♥
//                 </span>
//               </Button>
//               <Button
//                 className="flex-1 ml-2"
//                 onClick={() => handleAddToCart(product)}
//                 disabled={!product.availability}
//               >
//                 <span className="mr-2">🛒</span> Thêm vào giỏ
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }