import * as React from "react";

/**
 * Mobile breakpoint threshold in pixels
 * Below this width, the device is considered mobile
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook for detecting mobile device screen size
 *
 * This hook uses a media query to detect if the current viewport width
 * is below the mobile breakpoint (768px). It handles client-side rendering
 * properly and returns undefined during SSR to prevent hydration mismatches.
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useIsMobile();
 *
 *   if (isMobile === undefined) {
 *     // Still loading/SSR
 *     return <div>Loading...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {boolean | undefined} True if mobile, false if desktop, undefined during SSR
 */
export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    /**
     * Create media query list for mobile breakpoint
     */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /**
     * Handle media query changes
     * Updates the mobile state when viewport size changes
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener for media query changes
    mql.addEventListener("change", onChange);

    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup event listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
