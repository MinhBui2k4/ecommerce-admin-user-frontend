import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { GET_ALL_PRODUCTS } from "../api/apiService";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GET_ALL_PRODUCTS({ pageNumber: 0, pageSize: 10 })
            .then((response) => {
                setProducts(response.content);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                alert("Failed to load products");
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}