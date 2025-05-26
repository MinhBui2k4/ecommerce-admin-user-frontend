import classNames from "classnames";

export function Input({ className, ...props }) {
  const classes = classNames(
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-red-600",
    className
  );

  return <input className={classes} {...props} />;
}