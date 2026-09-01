import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  className,
  disabled = false,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 p-3 border border-input rounded-md bg-background/60",
        className
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary border-input focus:ring-primary"
            disabled={disabled}
          />
          <span className="text-sm text-foreground">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
