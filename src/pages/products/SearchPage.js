import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import ProductGrid from "./ProductGrid";
import ProductSort from "./ProductSort";
import { GET_ALL_PRODUCTS } from "../../api/apiService";
import { toast } from "react-toastify";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [filters, setFilters] = useState({
    priceStart: null,
    priceEnd: null,
    categoryId: null,
    brandId: null,
  });
  const [sort, setSort] = useState({ sortBy: "id", sortOrder: "asc" });
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      navigate("/products");
    }
  }, [query, navigate]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      priceStart: null,
      priceEnd: null,
      categoryId: null,
      brandId: null,
    });
  };

  const handleSortChange = ({ sortBy, sortOrder }) => {
    setSort({ sortBy, sortOrder });
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Tìm kiếm sản phẩm</h1>
        <p className="text-gray-600">Vui lòng nhập từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Kết quả tìm kiếm cho: "{query}"
      </h1>
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="mb-6 w-full md:mb-0 md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} onReset={handleResetFilters} />
        </div>
        <div className="w-full md:w-3/4">
          <ProductSort onSortChange={handleSortChange} totalItems={totalItems} />
          <ProductGrid
            filters={{ search: query, ...filters }}
            sortBy={sort.sortBy}
            sortOrder={sort.sortOrder}
            onTotalItemsChange={setTotalItems}
          />
        </div>
      </div>
    </div>
  );
}