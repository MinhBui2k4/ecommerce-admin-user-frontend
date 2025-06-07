import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useState } from "react";

export default function ProductSort({ onSortChange, totalItems }) {
  const [selectedValue, setSelectedValue] = useState("newest");

  const handleSortChange = (value) => {
    setSelectedValue(value);
    let sortBy = "id";
    let sortOrder = "asc";
    switch (value) {
      case "newest":
        sortBy = "id";
        sortOrder = "desc";
        break;
      case "price-asc":
        sortBy = "price";
        sortOrder = "asc";
        break;
      case "price-desc":
        sortBy = "price";
        sortOrder = "desc";
        break;
      default:
        break;
    }
    onSortChange({ sortBy, sortOrder });
  };

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center">
        <span className="mr-2 text-sm font-semibold">Sắp xếp theo:</span>
        <Select value={selectedValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mới nhất" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold">Hiển thị:</span>
        <span className="ml-4 text-sm text-gray-600">
          1-{Math.min(totalItems, 9)} của {totalItems} sản phẩm
        </span>
      </div>
    </div>
  );
}