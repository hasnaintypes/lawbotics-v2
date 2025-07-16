/**
 * Shared Components Module
 *
 * This module exports all shared/reusable components used throughout the LawBotics application.
 * These components provide common functionality and maintain design consistency across the app.
 *
 * Component Categories:
 *
 * **Authentication & Navigation:**
 * - `AuthenticatedRedirect` - Redirects authenticated users to dashboard
 * - `Logo` - Main application branding component
 * - `ModeToggle` - Theme switching component
 *
 * **Loading States:**
 * - `LoadingSpinner` - Customizable loading spinner with text
 * - `FullPageLoader` - Full-page loading layout with optional navigation
 *
 * **Skeleton Placeholders:**
 * - `Skeleton` - Basic skeleton element for custom layouts
 * - `DocumentCardSkeleton` - Document card loading placeholder
 * - `AnalyticsCardSkeleton` - Analytics card loading placeholder
 * - `TableRowSkeleton` - Table row loading placeholder
 * - `DashboardSkeleton` - Complete dashboard loading layout
 *
 * @fileoverview Central export file for all shared/reusable components
 *
 * @example
 * ```tsx
 * // Import individual components
 * import { LoadingSpinner, Logo, ModeToggle } from "@/components/shared";
 *
 * // Use in a layout
 * function Layout() {
 *   return (
 *     <div>
 *       <header>
 *         <Logo />
 *         <ModeToggle />
 *       </header>
 *       <main>
 *         <LoadingSpinner title="Loading content..." />
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 */

// Authentication & Navigation Components
export { AuthenticatedRedirect } from "./authenticated-redirect";
export { default as Logo } from "./logo";
export { ModeToggle } from "./mode-toggle";

// Loading Components
export { LoadingSpinner, FullPageLoader } from "./loading-spinner";

// Skeleton Components
export {
  Skeleton,
  DocumentCardSkeleton,
  AnalyticsCardSkeleton,
  TableRowSkeleton,
  DashboardSkeleton,
} from "./skeleton";
