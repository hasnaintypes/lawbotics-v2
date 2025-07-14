"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Interface for the return value of useThemeToggle hook
 */
export interface UseThemeToggleReturn {
  /** Current resolved theme ('light' | 'dark' | 'system') */
  resolvedTheme: string | undefined;
  /** Whether the component has mounted on the client */
  mounted: boolean;
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
  /** Function to set a specific theme */
  setTheme: (theme: string) => void;
}

/**
 * Custom hook for managing theme toggling functionality
 *
 * This hook provides a convenient interface for toggling between light and dark themes
 * using next-themes. It handles the mounting state to prevent hydration mismatches
 * and provides easy theme switching functionality.
 *
 * @example
 * ```tsx
 * function ThemeButton() {
 *   const { mounted, resolvedTheme, toggleTheme } = useThemeToggle();
 *
 *   if (!mounted) return null;
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       {resolvedTheme === 'dark' ? '🌞' : '🌙'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {UseThemeToggleReturn} Object containing theme state and toggle functions
 */
export function useThemeToggle(): UseThemeToggleReturn {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /**
   * Set mounted to true after component mounts to prevent hydration mismatch
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Toggle between light and dark themes
   * Switches from dark to light or light to dark
   */
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    resolvedTheme,
    mounted,
    toggleTheme,
    setTheme,
  };
}
