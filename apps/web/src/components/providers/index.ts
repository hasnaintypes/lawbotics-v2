/**
 * Providers Module
 *
 * This module exports all provider components used to wrap the application
 * with various contexts and functionality. These providers enable features
 * like theme switching, database access, authentication, and other global
 * application state management.
 *
 * Provider Categories:
 *
 * **Theme Management:**
 * - `ThemeProvider` - Theme switching and persistence functionality
 *
 * **Database & Authentication:**
 * - `ConvexProvider` - Real-time database with Clerk authentication integration
 *
 * Usage Pattern:
 * Providers should be nested in the correct order in your root layout:
 * 1. ClerkProvider (authentication)
 * 2. ThemeProvider (theme management)
 * 3. ConvexProvider (database with auth)
 * 4. Other providers as needed
 *
 * @fileoverview Central export file for all provider components
 *
 * @example
 * ```tsx
 * // Import providers
 * import { ThemeProvider, ConvexProvider } from "@/components/providers";
 * import { ClerkProvider } from "@clerk/nextjs";
 *
 * // Use in root layout
 * function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <ClerkProvider>
 *       <html lang="en">
 *         <body>
 *           <ThemeProvider
 *             attribute="class"
 *             defaultTheme="system"
 *             enableSystem
 *           >
 *             <ConvexProvider>
 *               {children}
 *             </ConvexProvider>
 *           </ThemeProvider>
 *         </body>
 *       </html>
 *     </ClerkProvider>
 *   );
 * }
 * ```
 */

// Theme Management
export { ThemeProvider } from "./theme-provider";

// Database & Authentication
export { ConvexProvider } from "./convex-provider";
