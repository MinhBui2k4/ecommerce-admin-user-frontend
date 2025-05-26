import { Link } from "react-router-dom";
import { ADD_TO_CART, ADD_TO_WISHLIST } from "../api/apiService";

export default function ProductCard({ product }) {
    const handleAddToCart = async () => {
        try {
            await ADD_TO_CART({ productId: product.id, quantity: 1 });
            alert("Added to cart!");
        } catch (error) {
            alert("Failed to add to cart");
        }
    };

    const handleAddToWishlist = async () => {
        try {
            await ADD_TO_WISHLIST({ productId: product.id });
            alert("Added to wishlist!");
        } catch (error) {
            alert("Failed to add to wishlist");
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <img
                src={`http://localhost:8080/api/products/image/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            {product.isSale && <span className="text-red-500">Sale!</span>}
            <div className="mt-4 flex justify-between">
                <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
                    View Details
                </Link>
                <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add to Cart
                </button>
                <button onClick={handleAddToWishlist} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Add to Wishlist
                </button>
            </div>
        </div>
    );
}