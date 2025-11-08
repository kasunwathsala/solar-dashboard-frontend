import React from "react";
import { cn } from "@/lib/utils";

// Simple Card component compatible with <Card className="..."> usage
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-lg", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;