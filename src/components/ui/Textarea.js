import classNames from "classnames";

export function Textarea({ className, ...props }) {
  const classes = classNames(
    "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-red-600",
    className
  );

  return <textarea className={classes} {...props} />;
}