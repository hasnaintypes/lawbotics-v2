"use client";

import { useThemeToggle } from "@/hooks";
import { MoonStar, Sun } from "lucide-react";

/**
 * ModeToggle Component
 *
 * A theme toggle button component that allows users to switch between light and dark modes.
 * Uses the custom useThemeToggle hook for theme management and handles client-side rendering
 * properly to prevent hydration mismatches.
 *
 * Features:
 * - Toggle between light and dark themes
 * - Smooth icon transitions
 * - Proper accessibility attributes
 * - Client-side hydration handling
 * - Hover effects and visual feedback
 * - Uses custom theme hook for consistency
 *
 * @example
 * ```tsx
 * // In a navigation bar
 * function Navigation() {
 *   return (
 *     <nav>
 *       <div className="flex items-center gap-4">
 *         <Logo />
 *         <ModeToggle />
 *       </div>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a settings panel
 * function SettingsPanel() {
 *   return (
 *     <div className="space-y-4">
 *       <h3>Appearance</h3>
 *       <div className="flex items-center justify-between">
 *         <span>Theme</span>
 *         <ModeToggle />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The theme toggle button component
 */
export function ModeToggle() {
  const { mounted, resolvedTheme, toggleTheme } = useThemeToggle();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="p-1 w-[34px] h-[34px] rounded-md" aria-hidden="true" />
    ); // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-md hover:bg-accent transition-colors"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      type="button"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonStar className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
