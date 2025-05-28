import React, { useState } from "react";
import classNames from "classnames";

export function Select({ defaultValue, onValueChange, children }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onChange: handleChange })
      )}
    </div>
  );
}

export function SelectTrigger({ className, children, value }) {
  return (
    <div
      className={classNames(
        "flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        className
      )}
    >
      {children || value}
      <span className="ml-2">▼</span>
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children, value, onChange }) {
  return (
    <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { selectedValue: value, onSelect: onChange })
      )}
    </div>
  );
}

export function SelectItem({ value, children, selectedValue, onSelect }) {
  return (
    <div
      className={classNames(
        "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100",
        selectedValue === value ? "bg-blue-100 text-blue-600" : ""
      )}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}