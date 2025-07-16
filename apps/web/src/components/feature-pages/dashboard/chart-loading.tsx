/**
 * Chart Loading Component
 *
 * Professional loading state component for charts with animated skeleton
 * and informative messaging.
 */

/**
 * Props for the ChartLoading component
 */
interface ChartLoadingProps {
  /** Custom title for the loading state */
  title?: string;
  /** Custom description for the loading state */
  description?: string;
  /** Height of the loading container */
  height?: string;
}

/**
 * Animated skeleton chart representation
 */
function ChartSkeleton() {
  return (
    <div className="w-full h-48 flex items-end justify-center space-x-2 px-8">
      {/* Animated bars representing a chart */}
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          className="bg-muted/40 rounded-t-sm flex-1 animate-pulse"
          style={{
            height: `${Math.random() * 60 + 20}%`,
            animationDelay: `${i * 100}ms`,
            animationDuration: "1.5s",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Loading indicator dots
 */
function LoadingDots() {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 200}ms`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}

/**
 * ChartLoading Component
 *
 * Displays an animated loading state for charts with skeleton bars,
 * loading indicators, and informative messaging.
 *
 * @param props - Component props
 * @returns Professional chart loading component
 *
 * @example
 * ```tsx
 * <ChartLoading
 *   title="Loading Analytics"
 *   description="Fetching your document data"
 * />
 * ```
 */
export function ChartLoading({
  title = "Loading Chart Data",
  description = "Please wait while we prepare your analytics",
  height = "h-[300px]",
}: ChartLoadingProps) {
  return (
    <div
      className={`${height} w-full flex flex-col items-center justify-center bg-muted/5 rounded-lg border border-muted-foreground/10 relative overflow-hidden`}
    >
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 px-6">
        {/* Chart skeleton */}
        <div className="w-full max-w-xs mx-auto">
          <ChartSkeleton />
        </div>

        {/* Loading text and indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
            <LoadingDots />
          </div>

          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            {description}
          </p>

          {/* Progress indicator */}
          <div className="w-32 h-1 bg-muted/30 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-primary/60 rounded-full animate-pulse"
              style={{
                width: "60%",
                animation: "loading-progress 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes loading-progress {
          0%,
          100% {
            width: 20%;
          }
          50% {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
}
