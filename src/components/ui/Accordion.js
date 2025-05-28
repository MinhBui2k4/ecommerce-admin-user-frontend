import React, { useState } from "react";
import classNames from "classnames";

export function Accordion({ type = "single", defaultValue, children }) {
  const [openItems, setOpenItems] = useState(
    type === "multiple" ? defaultValue || [] : [defaultValue]
  );

  const toggleItem = (value) => {
    if (type === "multiple") {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    } else {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { openItems, toggleItem })
      )}
    </div>
  );
}

export function AccordionItem({ value, children, openItems, toggleItem }) {
  return (
    <div className="border-b">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, isOpen: openItems.includes(value), toggleItem })
      )}
    </div>
  );
}

export function AccordionTrigger({ value, children, isOpen, toggleItem }) {
  return (
    <button
      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
      onClick={() => toggleItem(value)}
    >
      {children}
      <span className={classNames("ml-2", isOpen ? "rotate-180" : "")}>▼</span>
    </button>
  );
}

export function AccordionContent({ children, isOpen }) {
  if (!isOpen) return null;
  return <div className="pb-3">{children}</div>;
}