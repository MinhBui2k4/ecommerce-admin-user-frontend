import classNames from "classnames";

export function Label({ htmlFor, className, children, ...props }) {
  const classes = classNames("text-sm font-medium text-gray-700", className);
  return (
    <label htmlFor={htmlFor} className={classes} {...props}>
      {children}
    </label>
  );
}