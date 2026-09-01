import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export interface TooltipProps {
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function Tooltip({ content, isOpen, onToggle, className }: TooltipProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "ml-2 text-muted-foreground h-auto w-auto p-1",
          "hover:text-foreground transition-colors"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        type="button"
        aria-label="Show tooltip"
      >
        <Info size={14} />
      </Button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-10 p-3 rounded-md text-sm left-0 -top-12 shadow-lg border border-border animate-in fade-in",
            "bg-white text-gray-800",
            "dark:bg-gray-800 dark:text-gray-100",
            className
          )}
        >
          {content}
        </div>
      )}
    </>
  );
}
