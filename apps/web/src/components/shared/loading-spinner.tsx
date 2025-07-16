import * as React from "react";

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** The main loading message displayed prominently */
  title?: string;
  /** Descriptive text below the title providing context */
  description?: string;
  /** Additional informational text for more context */
  subtitle?: string;
  /** Size variant controlling spinner and text sizes */
  size?: "sm" | "md" | "lg";
  /** Whether to show the animated dots after description */
  showDots?: boolean;
}

/**
 * LoadingSpinner Component
 *
 * A professional, customizable loading spinner with dual-ring animation and informative text.
 * Features smooth animations, responsive sizing, and comprehensive loading feedback for users.
 *
 * Features:
 * - Dual-ring spinner with counter-rotating animation
 * - Bouncing dots animation for enhanced visual feedback
 * - Multiple size variants (sm, md, lg)
 * - Customizable title, description, and subtitle
 * - Responsive text sizing based on spinner size
 * - Accessible markup and proper contrast
 * - Smooth CSS animations with proper timing
 *
 * @param props - The component props
 * @param props.title - Main loading message (default: "Loading")
 * @param props.description - Contextual description (default: "Please wait")
 * @param props.subtitle - Additional information text
 * @param props.size - Size variant: "sm" | "md" | "lg" (default: "md")
 * @param props.showDots - Show animated dots (default: true)
 * @returns A comprehensive loading spinner component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 *
 * // With custom messaging
 * <LoadingSpinner
 *   title="Loading Dashboard"
 *   description="Fetching your documents"
 *   subtitle="Please wait while we prepare your data"
 * />
 *
 * // Large spinner without dots
 * <LoadingSpinner
 *   size="lg"
 *   title="Processing Document"
 *   showDots={false}
 * />
 *
 * // Small inline spinner
 * <LoadingSpinner
 *   size="sm"
 *   title="Saving..."
 *   description=""
 * />
 * ```
 */
export function LoadingSpinner({
  title = "Loading",
  description = "Please wait",
  subtitle,
  size = "md",
  showDots = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className="flex items-center justify-center min-h-[400px]"
      role="status"
      aria-live="polite"
    >
      <div className="text-center space-y-6">
        {/* Animated dual spinner */}
        <div className="relative flex justify-center">
          <div
            className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}
            aria-hidden="true"
          ></div>
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto`}
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Loading text with animation */}
        <div className="space-y-2">
          <h2 className={`${titleSizes[size]} font-semibold text-foreground`}>
            {title}
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <p className="text-muted-foreground">{description}</p>
            {showDots && (
              <div className="flex space-x-1" aria-hidden="true">
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Additional info */}
        {subtitle && (
          <div className="max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Props for FullPageLoader component extending LoadingSpinnerProps
 */
interface FullPageLoaderProps extends LoadingSpinnerProps {
  /** Whether to show the top navigation bar */
  showNavigation?: boolean;
  /** Navigation search query (if navigation is shown) - currently unused */
  searchQuery?: string;
  /** Navigation search setter (if navigation is shown) - currently unused */
  setSearchQuery?: (query: string) => void;
}

/**
 * FullPageLoader Component
 *
 * A full-page loading wrapper that provides a complete loading experience
 * with optional navigation header and centered spinner content.
 *
 * Features:
 * - Full viewport height layout
 * - Optional navigation header with placeholder content
 * - Centered loading spinner with all LoadingSpinner features
 * - Proper backdrop and z-index handling
 * - Responsive design with container constraints
 * - Semantic HTML structure for accessibility
 *
 * @param props - Component props extending LoadingSpinnerProps
 * @param props.showNavigation - Display navigation header (default: false)
 * @param props.searchQuery - Search query for navigation (future use)
 * @param props.setSearchQuery - Search setter for navigation (future use)
 * @param props...spinnerProps - All LoadingSpinner props are forwarded
 * @returns A full-page loading layout component
 *
 * @example
 * ```tsx
 * // Basic full-page loader
 * <FullPageLoader
 *   title="Loading Application"
 *   description="Setting up your workspace"
 * />
 *
 * // With navigation header
 * <FullPageLoader
 *   showNavigation={true}
 *   title="Loading Dashboard"
 *   description="Preparing your data"
 *   size="lg"
 * />
 *
 * // In a page component
 * function DashboardPage() {
 *   const [loading, setLoading] = useState(true);
 *
 *   if (loading) {
 *     return (
 *       <FullPageLoader
 *         showNavigation
 *         title="Loading Dashboard"
 *         subtitle="This may take a few moments"
 *       />
 *     );
 *   }
 *
 *   return <DashboardContent />;
 * }
 * ```
 */
export function FullPageLoader({
  showNavigation = false,
  searchQuery = "",
  setSearchQuery,
  ...spinnerProps
}: FullPageLoaderProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showNavigation && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Navigation placeholder or actual navigation component */}
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
                <div
                  className="h-5 w-5 bg-primary-foreground rounded"
                  aria-hidden="true"
                ></div>
              </div>
              <span className="font-semibold">Loading...</span>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 flex items-center justify-center">
        <LoadingSpinner {...spinnerProps} />
      </main>
    </div>
  );
}
