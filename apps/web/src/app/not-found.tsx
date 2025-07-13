import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 404 Not Found Page Component
 *
 * A user-friendly 404 error page that provides clear information about the
 * missing resource and offers navigation options to help users continue
 * their journey through the application.
 *
 * Features:
 * - Large, attention-grabbing 404 display
 * - Clear error messaging with helpful context
 * - Call-to-action button to return to dashboard
 * - Responsive design with proper spacing
 * - Accessible markup and semantic structure
 * - Consistent branding and styling
 *
 * This page is automatically shown by Next.js when a route is not found
 * and no custom 404 page exists at a more specific level.
 *
 * @returns The 404 error page component
 *
 * @example
 * ```tsx
 * // This page is automatically rendered by Next.js for 404 errors
 * // No manual usage required - Next.js handles routing automatically
 *
 * // For custom 404 pages at specific route levels, create not-found.tsx
 * // in the appropriate route directory
 * ```
 */
export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center py-20"
      role="main"
      aria-labelledby="not-found-title"
    >
      <div className="container flex flex-col items-center text-center">
        {/* Large 404 Display */}
        <h1
          id="not-found-title"
          className="text-9xl font-bold text-primary"
          aria-label="Error 404"
        >
          404
        </h1>

        {/* Error Heading */}
        <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>

        {/* Error Description */}
        <p className="mt-4 text-xl text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <Button asChild className="rounded-full">
            <Link href="/dashboard" aria-label="Return to dashboard">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
