/**
 * Chart Placeholder Component
 *
 * Professional placeholder component for when chart data is insufficient or unavailable.
 * Features adaptive icons based on chart type and informative messaging.
 */

interface ChartPlaceholderProps {
  /** The message to display in the placeholder */
  message: string;
  /** The type of chart (optional, for customized icons) */
  chartType?: "bar" | "pie" | "area" | "line";
}

/**
 * Chart icon component that adapts based on chart type
 */
function ChartIcon({
  chartType,
}: {
  chartType?: ChartPlaceholderProps["chartType"];
}) {
  switch (chartType) {
    case "pie":
      return (
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-4 border-muted-foreground/20 border-t-muted-foreground/40 animate-pulse"></div>
        </div>
      );

    case "area":
    case "line":
      return (
        <div className="relative">
          <svg
            width="32"
            height="20"
            viewBox="0 0 32 20"
            className="text-muted-foreground/30"
          >
            <polyline
              points="0,15 8,10 16,12 24,5 32,8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-pulse"
            />
            <polygon
              points="0,15 8,10 16,12 24,5 32,8 32,20 0,20"
              fill="currentColor"
              opacity="0.1"
              className="animate-pulse"
            />
          </svg>
        </div>
      );

    default: // bar chart
      return (
        <div className="flex items-end space-x-1">
          <div className="w-2 h-6 bg-muted-foreground/20 rounded-sm animate-pulse"></div>
          <div className="w-2 h-4 bg-muted-foreground/30 rounded-sm animate-pulse delay-75"></div>
          <div className="w-2 h-8 bg-muted-foreground/20 rounded-sm animate-pulse delay-150"></div>
          <div className="w-2 h-5 bg-muted-foreground/30 rounded-sm animate-pulse delay-225"></div>
        </div>
      );
  }
}

/**
 * ChartPlaceholder Component
 *
 * Displays a professional placeholder when chart data is insufficient or unavailable.
 * Features a clean design with subtle animations, grid background, and clear messaging.
 *
 * @param props - Component props
 * @returns Professional chart placeholder with adaptive icons
 *
 * @example
 * ```tsx
 * <ChartPlaceholder
 *   message="Upload documents to see weekly activity trends"
 *   chartType="bar"
 * />
 * ```
 */
export function ChartPlaceholder({
  message,
  chartType,
}: ChartPlaceholderProps) {
  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/30 rounded-lg border border-muted-foreground/10 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="chart-placeholder-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#chart-placeholder-grid)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-4">
        {/* Chart icon container */}
        <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
          <ChartIcon chartType={chartType} />
        </div>

        {/* Text content */}
        <div className="space-y-2 max-w-sm px-4">
          <h3 className="text-sm font-semibold text-foreground/80">
            Insufficient Data
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>

          {/* Status indicator */}
          <div className="pt-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mr-2 animate-pulse"></div>
              Chart will populate automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
