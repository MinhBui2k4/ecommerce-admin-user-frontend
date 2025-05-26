import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID, ADD_TO_CART } from "../api/apiService";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GET_PRODUCT_BY_ID(id)
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                alert("Failed to load product");
            });
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await ADD_TO_CART({ productId: product.id, quantity: 1 });
            alert("Added to cart!");
        } catch (error) {
            alert("Failed to add to cart");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <img
                src={`http://localhost:8080/api/products/image/${product.image}`}
                alt={product.name}
                className="w-full md:w-1/2 h-96 object-cover"
            />
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-semibold mb-4">${product.price}</p>
                <button onClick={handleAddToCart} className="bg-blue-500 text-white px-6 py-2 rounded">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}