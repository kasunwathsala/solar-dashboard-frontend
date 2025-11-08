import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const SelectContext = createContext(null);

export function Select({ value: controlledValue, onValueChange, defaultValue, children }) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [items, setItems] = useState([]);

  const value = isControlled ? controlledValue : internalValue;
  const setValue = (v) => {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
  };

  const registerItem = (item) => {
    setItems((prev) => {
      // avoid duplicates by value
      if (prev.some((i) => i.value === item.value)) return prev;
      return [...prev, item];
    });
  };

  const ctx = useMemo(() => ({ value, setValue, items, registerItem }), [value, items]);

  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
      value={ctx.value}
      onChange={(e) => ctx.setValue(e.target.value)}
    >
      {ctx.items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export function SelectValue() {
  // No-op placeholder for API compatibility
  return null;
}

export function SelectContent({ children }) {
  // No UI needed; items are collected via SelectItem registration
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext);
  useEffect(() => {
    if (ctx) ctx.registerItem({ value, label: children });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, children]);
  return null; // Not rendered directly; used to populate the native select
}

export default Select;