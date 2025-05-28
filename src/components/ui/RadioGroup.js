import classNames from "classnames";
import React from "react";

export function RadioGroup({ value, onValueChange, className, children }) {
  return (
    <div className={classNames("space-y-2", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { selectedValue: value, onChange: onValueChange })
      )}
    </div>
  );
}

export function RadioGroupItem({ value, id, selectedValue, onChange }) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={selectedValue === value}
      onChange={() => onChange(value)}
      className="h-4 w-4 text-red-600 focus:ring-red-600"
    />
  );
}