import * as React from "react";

/**
 * Props for skeleton components
 */
interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate the skeleton */
  animate?: boolean;
}

/**
 * Basic Skeleton Component
 *
 * A simple skeleton placeholder that shows a loading state.
 *
 * @param props - The component props
 * @returns A skeleton loading element
 */
export function Skeleton({ className = "", animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-muted rounded-md ${animate ? "animate-pulse" : ""} ${className}`}
    />
  );
}

/**
 * Document Card Skeleton
 *
 * A skeleton placeholder for document cards in the dashboard.
 */
export function DocumentCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Analytics Card Skeleton
 *
 * A skeleton placeholder for analytics cards.
 */
export function AnalyticsCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton
 *
 * A skeleton placeholder for table rows.
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Dashboard Skeleton
 *
 * A complete skeleton layout for the dashboard page.
 */
export function DashboardSkeleton() {
  return (
    <div className="container py-6 space-y-8">
      {/* Welcome section skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Analytics cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AnalyticsCardSkeleton key={index} />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>

      {/* Documents section skeleton */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <DocumentCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
