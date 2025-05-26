import classNames from "classnames";

export function Badge({ variant = "default", className, children, ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white",
  };

  const classes = classNames(
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
    variants[variant],
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}