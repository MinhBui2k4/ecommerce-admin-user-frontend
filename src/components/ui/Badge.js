import classNames from "classnames";

export function Badge({ variant = "default", className, children, ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",

    processing: "bg-blue-500 text-white",
    shipped: "bg-orange-500 text-white",
    completed: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
    ordered: "bg-gray-500 text-white",
    confirmed: "bg-purple-500 text-white",
  };

  const classes = classNames(
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold shadow",
    variants[variant],
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
