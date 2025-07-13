import * as React from "react";

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** The main loading message */
  title?: string;
  /** Descriptive text below the title */
  description?: string;
  /** Additional info text */
  subtitle?: string;
  /** Size variant of the spinner */
  size?: "sm" | "md" | "lg";
  /** Whether to show the animated dots */
  showDots?: boolean;
}

/**
 * LoadingSpinner Component
 *
 * A professional loading spinner with customizable text and animations.
 * Features a dual-ring spinner with bouncing dots and informative text.
 *
 * @param props - The component props
 * @returns A centered loading spinner component
 *
 * @example
 * ```tsx
 * <LoadingSpinner
 *   title="Loading Dashboard"
 *   description="Fetching your documents"
 *   subtitle="Please wait while we prepare your data"
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
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-6">
        {/* Animated dual spinner */}
        <div className="relative flex justify-center">
          <div
            className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}
          ></div>
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto`}
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
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
              <div className="flex space-x-1">
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
 * FullPageLoader Component
 *
 * A full-page loading wrapper that includes navigation and centers the spinner.
 * Useful for page-level loading states.
 *
 * @param props - The component props extending LoadingSpinnerProps
 * @returns A full-page loading component
 */
interface FullPageLoaderProps extends LoadingSpinnerProps {
  /** Whether to show the top navigation */
  showNavigation?: boolean;
  /** Navigation search query (if navigation is shown) */
  searchQuery?: string;
  /** Navigation search setter (if navigation is shown) */
  setSearchQuery?: (query: string) => void;
}

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
                <div className="h-5 w-5 bg-primary-foreground rounded"></div>
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
