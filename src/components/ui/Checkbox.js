import classNames from "classnames";

export function Checkbox({ id, checked, onCheckedChange, className, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={classNames(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600",
        className
      )}
      {...props}
    />
  );
}