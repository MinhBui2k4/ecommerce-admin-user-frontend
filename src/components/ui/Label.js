import classNames from "classnames";

export function Label({ htmlFor, className, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames("text-sm font-medium text-gray-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}