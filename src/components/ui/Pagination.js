import classNames from "classnames";

export function Pagination({ className, children }) {
  return <nav className={classNames("flex justify-center", className)}>{children}</nav>;
}

export function PaginationContent({ children }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}

export function PaginationItem({ children }) {
  return <div>{children}</div>;
}

export function PaginationLink({ href, isActive, onClick, children }) {
  return (
    <a
      href={href}
      className={classNames(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-sm",
        isActive ? "bg-red-600 text-white" : "hover:bg-gray-100"
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

export function PaginationPrevious({ href, onClick, className }) {
  return (
    <a
      href={href}
      className={classNames("inline-flex h-10 items-center rounded-md px-4 text-sm hover:bg-gray-100", className)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span>Trước</span>
    </a>
  );
}

export function PaginationNext({ href, onClick, className }) {
  return (
    <a
      href={href}
      className={classNames("inline-flex h-10 items-center rounded-md px-4 text-sm hover:bg-gray-100", className)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span>Tiếp</span>
    </a>
  );
}

export function PaginationEllipsis() {
  return <span className="text-sm">...</span>;
}