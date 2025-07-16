"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoonStar, Sun } from "lucide-react";
import Logo from "@/components/shared/logo";
import { SignInButton } from "@clerk/nextjs";
import { useThemeToggle, useScrollDetection } from "@/hooks";

/**
 * Navigation bar component for the application
 *
 * This component renders a sticky navigation header with the following features:
 * - Logo and branding
 * - Theme toggle button (light/dark mode)
 * - Sign in button
 * - Responsive design with scroll-based styling
 * - Backdrop blur effect when scrolled
 *
 * The navbar automatically adjusts its appearance based on scroll position,
 * adding a border and enhanced styling when the user scrolls down.
 *
 * @example
 * ```tsx
 * function Layout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <>
 *       <Navbar />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 * ```
 *
 * @returns The navigation bar component
 */
export function Navbar() {
  const { mounted, resolvedTheme, toggleTheme } = useThemeToggle();
  const { isScrolled } = useScrollDetection({ threshold: 10 });

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return <div className="h-16" />; // Placeholder to prevent layout shift

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-200",
        isScrolled && "border-b"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and branding section */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center space-x-2"
            aria-label="Go to homepage"
          >
            <Logo />
          </a>
        </div>

        {/* Action buttons section */}
        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
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

          {/* Sign in button */}
          <SignInButton mode="modal">
            <Button className="rounded-full">Get Started</Button>
          </SignInButton>
        </div>
      </div>
    </header>
  );
}
