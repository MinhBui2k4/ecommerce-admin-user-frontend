import { useState } from "react";
import ProductFilter from "./products/ProductFilter";
import ProductGrid from "./products/ProductGrid";
import ProductSort from "./products/ProductSort";

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    priceStart: null,
    priceEnd: null,
    categoryId: null,
    brandId: null,
  });
  const [sort, setSort] = useState({ sortBy: "id", sortOrder: "asc" });
  const [totalItems, setTotalItems] = useState(0);

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

  const handleTotalItemsChange = (total) => {
    setTotalItems(total);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Sản phẩm</h1>

      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="mb-6 w-full md:mb-0 md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} onReset={handleResetFilters} />
        </div>

        <div className="w-full md:w-3/4">
          <ProductSort onSortChange={handleSortChange} totalItems={totalItems} />
          <ProductGrid
            filters={filters}
            sortBy={sort.sortBy}
            sortOrder={sort.sortOrder}
            onTotalItemsChange={handleTotalItemsChange}
          />
        </div>
      </div>
    </div>
  );
}