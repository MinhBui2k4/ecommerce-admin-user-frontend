import classNames from "classnames";

export function Card({ className, children, ...props }) {
  const classes = classNames("border rounded-lg bg-white shadow-sm", className);
  return <div className={classes} {...props}>{children}</div>;
}

export function CardContent({ className, children, ...props }) {
  const classes = classNames("p-4", className);
  return <div className={classes} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  const classes = classNames("p-4 pt-0", className);
  return <div className={classes} {...props}>{children}</div>;
}