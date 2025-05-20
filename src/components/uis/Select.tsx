import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative group">
        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
        <div className="absolute inset-0 rounded-md border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        <select
          className={cn(
            "w-full appearance-none p-2 pr-8 border border-input rounded-md bg-background/80 backdrop-blur-sm text-foreground",
            "focus-visible:ring-offset-2 focus:ring-2 focus:ring-primary/50 focus:border-primary/30 focus:outline-none",
            "transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary/5",
            "group-hover:border-primary/40 group-hover:bg-background/90",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <ChevronDown className="h-3 w-3 text-primary/60 group-hover:text-primary/80 transition-colors duration-200" />
          </div>
        </div>
        
        {/* Film frame decorative element */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-[70%] w-1 flex flex-col justify-around opacity-20 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-[2px] bg-primary/60"></div>
          ))}
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
