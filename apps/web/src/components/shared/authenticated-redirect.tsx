"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/**
 * AuthenticatedRedirect Component
 *
 * A client-side component that redirects authenticated users to the dashboard.
 * This component should be placed on public pages where you want to redirect
 * logged-in users automatically.
 *
 * Features:
 * - Checks user authentication status using Clerk
 * - Redirects authenticated users to /dashboard
 * - Shows loading state during redirect
 * - Prevents flash of public content for authenticated users
 * - Non-blocking for unauthenticated users
 *
 * @returns JSX element with loading state or null
 *
 * @example
 * ```tsx
 * // In your public page component
 * export default function HomePage() {
 *   return (
 *     <>
 *       <AuthenticatedRedirect />
 *       <main>
 *         // Your public page content
 *       </main>
 *     </>
 *   );
 * }
 * ```
 */
export function AuthenticatedRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect after Clerk has loaded and we have a confirmed authenticated user
    if (isLoaded && user) {
      console.log("Authenticated user detected, redirecting to dashboard...");
      setIsRedirecting(true);
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  // Show loading spinner while redirecting authenticated users
  if (isRedirecting || (isLoaded && user)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything for unauthenticated users or while loading
  return null;
}
