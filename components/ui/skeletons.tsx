import { Skeleton } from "@/components/ui/skeleton";

// ─── Table Skeleton ───────────────────────────────────────────
interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}
export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: cols }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <Skeleton className={`h-4 ${colIdx === 0 ? "w-16" : colIdx === cols - 1 ? "w-12" : "w-28"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── KPI Cards Skeleton ───────────────────────────────────────
interface KpiSkeletonProps {
  count?: number;
  cols?: 2 | 4;
}
export function KpiSkeleton({ count = 4, cols = 4 }: KpiSkeletonProps) {
  return (
    <div className={`grid gap-3 sm:gap-4 ${cols === 4 ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2"}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

// ─── Activity List Skeleton ───────────────────────────────────
interface ActivitySkeletonProps {
  rows?: number;
}
export function ActivitySkeleton({ rows = 4 }: ActivitySkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Card Grid Skeleton (Taxes, Structures, Zones) ────────────
interface CardGridSkeletonProps {
  count?: number;
  cols?: 2 | 3;
}
export function CardGridSkeleton({ count = 6, cols = 2 }: CardGridSkeletonProps) {
  return (
    <div className={`grid gap-4 ${cols === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Chart Skeleton ──────────────────────────────────
interface ProgressSkeletonProps {
  rows?: number;
}
export function ProgressSkeleton({ rows = 3 }: ProgressSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-16 flex-shrink-0" />
          <Skeleton className="h-3 flex-1 rounded-full" />
          <Skeleton className="h-4 w-24 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
