"use client";

import { useState, useEffect } from "react";

/**
 * Interface for the return value of useScrollDetection hook
 */
export interface UseScrollDetectionReturn {
  /** Whether the page has been scrolled past the threshold */
  isScrolled: boolean;
  /** Current scroll position in pixels */
  scrollY: number;
}

/**
 * Options for configuring scroll detection behavior
 */
export interface UseScrollDetectionOptions {
  /** Scroll threshold in pixels before isScrolled becomes true */
  threshold?: number;
  /** Whether to include the current scroll position in the return value */
  includeScrollY?: boolean;
}

/**
 * Custom hook for detecting scroll position and scroll state
 *
 * This hook monitors the window scroll position and provides information about
 * whether the user has scrolled past a specified threshold. Useful for
 * implementing sticky headers, scroll-based animations, or conditional styling.
 *
 * @example
 * ```tsx
 * function StickyHeader() {
 *   const { isScrolled } = useScrollDetection({ threshold: 50 });
 *
 *   return (
 *     <header className={`transition-all ${isScrolled ? 'shadow-lg' : ''}`}>
 *       Content
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With scroll position tracking
 * function ScrollIndicator() {
 *   const { isScrolled, scrollY } = useScrollDetection({
 *     threshold: 100,
 *     includeScrollY: true
 *   });
 *
 *   return (
 *     <div>
 *       <p>Scrolled: {isScrolled ? 'Yes' : 'No'}</p>
 *       <p>Position: {scrollY}px</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {UseScrollDetectionOptions} options - Configuration options for scroll detection
 * @param {number} options.threshold - Scroll threshold in pixels (default: 10)
 * @param {boolean} options.includeScrollY - Whether to track scroll position (default: false)
 * @returns {UseScrollDetectionReturn} Object containing scroll state information
 */
export function useScrollDetection(
  options: UseScrollDetectionOptions = {}
): UseScrollDetectionReturn {
  const { threshold = 10, includeScrollY = false } = options;

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    /**
     * Handle scroll events and update scroll state
     * Updates both the scrolled boolean and scroll position if enabled
     */
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > threshold);

      if (includeScrollY) {
        setScrollY(currentScrollY);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Call once to set initial state
    handleScroll();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, includeScrollY]);

  return {
    isScrolled,
    scrollY,
  };
}
