import { cn } from '@/lib/utils';

export default function ShowcaseSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('collection-card animate-pulse motion-reduce:animate-none', className)}
      aria-hidden="true"
    >
      <div className="aspect-[16/10] bg-muted/60" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-6 w-2/3 rounded bg-muted" />
        <div className="h-14 rounded bg-muted/60" />
        <div className="h-11 w-28 rounded-lg bg-muted/60" />
        <div className="h-10 border-t border-border/60" />
      </div>
    </div>
  );
}
export function ShowcaseSkeletonGroup({ count = 6 }: { count?: number }) {
  return (
    <div className="collection-grid" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <ShowcaseSkeleton key={index} />
      ))}
    </div>
  );
}
