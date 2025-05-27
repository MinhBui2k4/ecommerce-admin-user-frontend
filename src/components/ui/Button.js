import classNames from "classnames";

export function Button({ variant = "default", size = "default", className, children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-600",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
    sm: "h-9 px-3 py-1.5",       // thêm kích cỡ nhỏ hơn nếu cần
    inputGroup: "h-10 px-4",    // dùng trong input group
  };

  const classes = classNames(baseStyles, variants[variant], sizes[size], className);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
