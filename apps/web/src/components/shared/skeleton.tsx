import * as React from "react";

/**
 * Props for skeleton components
 */
interface SkeletonProps {
  /** Additional CSS classes to apply to the skeleton */
  className?: string;
  /** Whether to animate the skeleton with pulse effect */
  animate?: boolean;
}

/**
 * Basic Skeleton Component
 *
 * A fundamental skeleton placeholder that shows a loading state with optional animation.
 * This component serves as the building block for more complex skeleton layouts.
 *
 * Features:
 * - Configurable animation (pulse effect)
 * - Customizable styling via className
 * - Consistent theming with muted colors
 * - Rounded corners for modern appearance
 *
 * @param props - The component props
 * @param props.className - Additional CSS classes to apply
 * @param props.animate - Whether to show pulse animation (default: true)
 * @returns A skeleton loading element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="h-4 w-32" />
 *
 * // Without animation
 * <Skeleton className="h-6 w-48" animate={false} />
 *
 * // Custom styling
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 */
export function Skeleton({ className = "", animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-muted rounded-md ${animate ? "animate-pulse" : ""} ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/**
 * Document Card Skeleton
 *
 * A skeleton placeholder specifically designed for document cards in the dashboard.
 * Mimics the structure of actual document cards with header, content, and footer sections.
 *
 * Features:
 * - Document title and metadata placeholders
 * - Content preview lines
 * - Status indicator and action button placeholders
 * - Consistent card layout matching real components
 *
 * @example
 * ```tsx
 * // In a document grid
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {Array.from({ length: 6 }).map((_, index) => (
 *     <DocumentCardSkeleton key={index} />
 *   ))}
 * </div>
 * ```
 *
 * @returns A document card skeleton component
 */
export function DocumentCardSkeleton() {
  return (
    <div
      className="border rounded-lg p-6 space-y-4"
      role="presentation"
      aria-hidden="true"
    >
      {/* Header section with title and action */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Content preview section */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      {/* Footer section with status and metadata */}

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
 * A skeleton placeholder specifically designed for analytics and metric cards.
 * Provides placeholders for key metrics, values, and optional chart areas.
 *
 * Features:
 * - Metric title and value placeholders
 * - Icon/chart area placeholder
 * - Secondary metrics and trends
 * - Consistent analytics card layout
 *
 * @example
 * ```tsx
 * // In analytics dashboard
 * <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 *   {Array.from({ length: 4 }).map((_, index) => (
 *     <AnalyticsCardSkeleton key={index} />
 *   ))}
 * </div>
 * ```
 *
 * @returns An analytics card skeleton component
 */
export function AnalyticsCardSkeleton() {
  return (
    <div
      className="border rounded-lg p-6 space-y-4"
      role="presentation"
      aria-hidden="true"
    >
      {/* Header with title and icon */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Additional metrics */}
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
 * A skeleton placeholder for table rows with configurable column count.
 * Useful for showing loading states in data tables and lists.
 *
 * Features:
 * - Configurable number of columns
 * - Consistent table cell spacing
 * - Proper table semantics
 * - Responsive design considerations
 *
 * @param props - The component props
 * @param props.columns - Number of columns to render (default: 5)
 *
 * @example
 * ```tsx
 * // In a table with loading state
 * <table>
 *   <tbody>
 *     {Array.from({ length: 5 }).map((_, index) => (
 *       <TableRowSkeleton key={index} columns={4} />
 *     ))}
 *   </tbody>
 * </table>
 * ```
 *
 * @returns A table row skeleton component
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr role="presentation" aria-hidden="true">
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
 * A comprehensive skeleton layout for the complete dashboard page.
 * Provides placeholders for all major dashboard sections including
 * welcome area, analytics cards, charts, and document grids.
 *
 * Features:
 * - Complete dashboard page structure
 * - Welcome section with actions
 * - Analytics cards grid
 * - Chart area placeholders
 * - Document section with grid layout
 * - Responsive design matching real dashboard
 *
 * @example
 * ```tsx
 * // In dashboard page while loading
 * function DashboardPage() {
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   if (isLoading) {
 *     return <DashboardSkeleton />;
 *   }
 *
 *   return <DashboardContent />;
 * }
 * ```
 *
 * @returns A complete dashboard skeleton layout
 */
export function DashboardSkeleton() {
  return (
    <div
      className="container py-6 space-y-8"
      role="presentation"
      aria-hidden="true"
    >
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
