import classNames from "classnames";

export default function Card({ className, children, ...props }) {
  const classes = classNames("border rounded-lg bg-white shadow-md", className);
  return <div className={classes} {...props}>{children}</div>;
}

export function CardHeader({ className, children, ...props }) {
  const classes = classNames("p-6 text-center space-y-1", className);
  return <div className={classes} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  const classes = classNames("text-2xl font-bold text-gray-900", className);
  return <h2 className={classes} {...props}>{children}</h2>;
}

export function CardDescription({ className, children, ...props }) {
  const classes = classNames("text-sm text-gray-500", className);
  return <p className={classes} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
  const classes = classNames("p-4", className);
  return <div className={classes} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  const classes = classNames("p-4 pt-0", className);
  return <div className={classes} {...props}>{children}</div>;
}