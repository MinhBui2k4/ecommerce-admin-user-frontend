import { useState } from "react";
import classNames from "classnames";

export function AlertDialog({ open, onOpenChange, children }) {
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {children}
      </div>
    </div>
  ) : null;
}

export function AlertDialogTrigger({ asChild, children }) {
  if (asChild) {
    return children;
  }
  return <button type="button">{children}</button>;
}

export function AlertDialogContent({ className, children }) {
  return <div className={classNames("space-y-4", className)}>{children}</div>;
}

export function AlertDialogHeader({ children }) {
  return <div>{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end space-x-2">{children}</div>;
}

export function AlertDialogAction({ onClick, className, children }) {
  return (
    <button
      onClick={onClick}
      className={classNames("px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700", className)}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
    >
      {children}
    </button>
  );
}