import classNames from "classnames";

export function Separator({ className, orientation = "horizontal" }) {
  const classes = classNames(
    orientation === "horizontal" ? "h-px w-full bg-gray-300" : "h-full w-px bg-gray-300",
    className
  );
  return <div className={classes} />;
}