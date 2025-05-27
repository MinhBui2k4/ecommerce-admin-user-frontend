import React, { useState } from "react";
import classNames from "classnames";

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsList({ className, children, activeTab, setActiveTab }) {
  return (
    <div className={classNames("flex border-b", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  return (
    <button
      className={classNames(
        "px-4 py-2 text-sm font-medium focus:outline-none",
        activeTab === value
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      )}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab }) {
  if (value !== activeTab) return null;
  return <div>{children}</div>;
}
