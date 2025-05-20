import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
}

export function Slider({
  className,
  min,
  max,
  value,
  onChange,
  showValue = true,
  showMinMax = true,
  formatValue = (value) => `${value}`,
  minLabel,
  maxLabel,
  disabled = false,
  ...props
}: SliderProps) {
  return (
    <div className={cn("p-4 border border-input rounded-md bg-background/60", className)}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary"
        disabled={disabled}
        {...props}
      />
      {(showValue || showMinMax) && (
        <div className="flex justify-between mt-2">
          {showMinMax && (
            <span className="text-xs text-muted-foreground">{minLabel || min}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium">{formatValue(value)}</span>
          )}
          {showMinMax && (
            <span className="text-xs text-muted-foreground">{maxLabel || max}</span>
          )}
        </div>
      )}
    </div>
  );
}
