"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * Theme Provider Component
 *
 * A wrapper around next-themes ThemeProvider that provides theme switching functionality
 * throughout the application. This component enables light/dark mode switching with
 * system preference detection and persistence.
 *
 * Features:
 * - Light and dark theme support
 * - System preference detection
 * - Theme persistence across sessions
 * - Smooth theme transitions
 * - SSR-safe hydration handling
 * - Custom theme attribute support
 *
 * This provider should be placed high in the component tree, typically in the
 * root layout, to ensure all components have access to theme context.
 *
 * @param props - ThemeProvider props from next-themes
 * @param props.children - Child components that will receive theme context
 * @param props.attribute - HTML attribute for theme switching (default: "class")
 * @param props.defaultTheme - Default theme when no preference is set
 * @param props.enableSystem - Enable system theme detection
 * @param props.disableTransitionOnChange - Disable CSS transitions during theme change
 * @returns Theme provider wrapper component
 *
 * @example
 * ```tsx
 * // Basic usage in root layout
 * function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider
 *           attribute="class"
 *           defaultTheme="system"
 *           enableSystem
 *           disableTransitionOnChange
 *         >
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom configuration
 * <ThemeProvider
 *   attribute="data-theme"
 *   defaultTheme="light"
 *   enableSystem={false}
 *   themes={["light", "dark", "blue"]}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
