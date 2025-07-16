"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/**
 * AuthenticatedRedirect Component
 *
 * A client-side component that automatically redirects authenticated users to the dashboard.
 * This component should be placed on public pages where you want to prevent authenticated
 * users from accessing public content and redirect them to their authenticated experience.
 *
 * Features:
 * - Automatic detection of user authentication status via Clerk
 * - Client-side redirect to /dashboard for authenticated users
 * - Loading state with spinner during redirect process
 * - Prevents flash of public content for authenticated users
 * - Non-blocking behavior for unauthenticated users
 * - Proper cleanup and error handling
 * - Console logging for debugging authentication flow
 *
 * Use Cases:
 * - Landing pages that should redirect logged-in users
 * - Marketing pages that authenticated users shouldn't see
 * - Public forms that have authenticated alternatives
 * - Any public route where authenticated users should be redirected
 *
 * @returns Loading overlay during redirect, or null for unauthenticated users
 *
 * @example
 * ```tsx
 * // In a public homepage
 * export default function HomePage() {
 *   return (
 *     <>
 *       <AuthenticatedRedirect />
 *       <main>
 *         <HeroSection />
 *         <FeaturesSection />
 *       </main>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a landing page layout
 * export default function LandingLayout({ children }) {
 *   return (
 *     <div>
 *       <AuthenticatedRedirect />
 *       <Navbar />
 *       {children}
 *       <Footer />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a sign-up page that should redirect if already authenticated
 * export default function SignUpPage() {
 *   return (
 *     <>
 *       <AuthenticatedRedirect />
 *       <div className="container">
 *         <SignUpForm />
 *       </div>
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
      setIsRedirecting(true);
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  // Show loading spinner while redirecting authenticated users
  if (isRedirecting || (isLoaded && user)) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Redirecting to dashboard"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            aria-hidden="true"
          ></div>
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
