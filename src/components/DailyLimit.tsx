import { cn } from "../lib/utils";

interface DailyLimitProps {
  current: number;
  max?: number;
  className?: string;
  title?: string;
}

export function DailyLimit({ 
  current, 
  max = 10, 
  className,
  title = "Daily Limit" 
}: DailyLimitProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  // Calculate status color based on percentage
  const getStatusColor = () => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <div className={cn("bg-accent/80 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-accent-foreground">
          {title}
        </span>
        <span className="text-sm font-medium text-accent-foreground">
          {current} / {max}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-600 shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            getStatusColor()
          )}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
