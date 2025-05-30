import { useState, useEffect } from "react";
import { Checkbox } from "../../components/ui/Checkbox";
import { Label } from "../../components/ui/Label";  
import { Button } from "../../components/ui/Button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/Accordion";
import { GET_ALL_BRANDS, GET_ALL_CATEGORIES } from "../../api/apiService";
import { toast } from "react-toastify";

export default function ProductFilter({ onFilterChange, onReset }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: null,
    categoryId: null,
    brandId: null,
  });
  const [loading, setLoading] = useState(true);

  const priceRanges = [
    { label: "Dưới 1 triệu", start: 0, end: 1000000 },
    { label: "1 - 3 triệu", start: 1000000, end: 3000000 },
    { label: "3 - 5 triệu", start: 3000000, end: 5000000 },
    { label: "5 - 10 triệu", start: 5000000, end: 10000000 },
    { label: "10 - 15 triệu", start: 10000000, end: 15000000 },
    { label: "15 - 20 triệu", start: 15000000, end: 20000000 },
    { label: "20 - 30 triệu", start: 20000000, end: 30000000 },
    { label: "Trên 30 triệu", start: 30000000, end: 10000000000 },
  ];

  useEffect(() => {
    Promise.all([
      GET_ALL_BRANDS(),
      GET_ALL_CATEGORIES(),
    ])
      .then(([brandsData, categoriesData]) => {
        setBrands(brandsData.content || []);
        setCategories(categoriesData.content || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch brands/categories:", error);
        toast.error("Không thể tải bộ lọc");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
  };

  const handleApplyFilters = () => {
    const selectedPriceRange = filters.priceRange ? priceRanges.find((range) => range.label === filters.priceRange) : null;
    const filterParams = {
      priceStart: selectedPriceRange ? selectedPriceRange.start : null,
      priceEnd: selectedPriceRange ? selectedPriceRange.end : null,
      categoryId: filters.categoryId,
      brandId: filters.brandId,
    };
    const validFilters = Object.fromEntries(
      Object.entries(filterParams).filter(([_, v]) => v !== null)
    );
    onFilterChange(validFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: null,
      categoryId: null,
      brandId: null,
    });
    onReset();
  };

  if (loading) return <p className="text-center py-4">Đang tải bộ lọc...</p>;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-lg font-semibold md:text-xl">Bộ lọc</h2>

      <Accordion type="multiple" defaultValue={["price", "category", "brand"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Khoảng giá</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div key={range.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range.label}`}
                    checked={filters.priceRange === range.label}
                    onCheckedChange={() => handleFilterChange("priceRange", range.label)}
                  />
                  <Label htmlFor={`price-${range.label}`}>{range.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger>Danh mục</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categoryId === category.id}
                    onCheckedChange={() => handleFilterChange("categoryId", category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Thương hiệu</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={filters.brandId === brand.id}
                    onCheckedChange={() => handleFilterChange("brandId", brand.id)}
                  />
                  <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 flex space-x-2">
        <Button className="flex-1" onClick={handleApplyFilters}>Áp dụng</Button>
        <Button variant="blue" className="flex-1" onClick={handleResetFilters}>Đặt lại</Button>
      </div>
    </div>
  );
}