import { useState } from "react";
import classNames from "classnames";

export function Checkbox({ id, checked, onCheckedChange, className }) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onCheckedChange) onCheckedChange(newChecked);
  };

  return (
    <input
      type="checkbox"
      id={id}
      checked={isChecked}
      onChange={handleChange}
      className={classNames(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600",
        className
      )}
    />
  );
}