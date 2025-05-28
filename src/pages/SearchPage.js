import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "./products/ProductGrid";
import ProductSort from "./products/ProductSort";
import ProductFilter from "./products/ProductFilter";
import { GET_PRODUCTS_BY_SEARCH } from "../api/apiService";
import { toast } from "react-toastify";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 9,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
  });
  const [filters, setFilters] = useState({
    priceStart: null,
    priceEnd: null,
    categoryId: null,
    brandId: null,
  });
  const [sort, setSort] = useState({ sortBy: "id", sortOrder: "asc" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const params = {
      search: query,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      ...filters
    };
    GET_PRODUCTS_BY_SEARCH(params)
      .then((response) => {
        setProducts(response.content.map((item) => ({
          ...item,
          reviews: 120, // Giả lập
        })));
        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements || response.content.length,
          totalPages: response.totalPages,
          lastPage: response.lastPage,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch search results:", error);
        toast.error("Không thể tải kết quả tìm kiếm");
        setLoading(false);
      });
  }, [query, pagination.pageNumber, sort.sortBy, sort.sortOrder, filters]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Kết quả tìm kiếm cho: "{query}"
      </h1>
      <p className="mb-4 text-sm text-gray-600">
        Tìm thấy {pagination.totalElements} sản phẩm
      </p>

      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="mb-6 w-full md:mb-0 md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} onReset={handleResetFilters} />
        </div>

        <div className="w-full md:w-3/4">
          <ProductSort
            onSortChange={handleSortChange}
            totalItems={pagination.totalElements}
          />
          <ProductGrid
            filters={{ ...filters, search: query }}
            sortBy={sort.sortBy}
            sortOrder={sort.sortOrder}
            onTotalItemsChange={(total) => {}}
          />
        </div>
      </div>
    </div>
  );
}