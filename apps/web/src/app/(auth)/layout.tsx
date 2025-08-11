import type React from "react";
import { Navbar } from "@/components/layout";

/**
 * Public pages layout component
 *
 * Provides the layout structure for all public-facing pages in the application.
 * This includes the main landing page, authentication pages, and other marketing
 * content. The layout ensures consistent navigation and footer across all public
 * pages while maintaining a flexible main content area.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 * @returns {JSX.Element} The rendered layout with navbar, main content, and footer
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js for pages in the (public) route group
 * export default function PublicPage() {
 *   return (
 *     <div>
 *       <h1>Welcome to LawBotics</h1>
 *       <p>This content will be wrapped with navbar and footer</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * // Layout structure provided:
 * // <Navbar />
 * // <main>{children}</main>
 * // <Footer />
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
