import { Shield } from "lucide-react";
import React from "react";

/**
 * Logo Component
 *
 * The main logo component for the LawBotics application. Displays the company
 * branding with an icon, company name, and tagline. The component is responsive
 * and optimized for various screen sizes.
 *
 * Features:
 * - Gradient shield icon with primary theme colors
 * - Company name with bold typography
 * - Responsive tagline (hidden on small screens)
 * - Consistent spacing and alignment
 * - Accessible semantic structure
 *
 * @example
 * ```tsx
 * // In navigation or header components
 * function Header() {
 *   return (
 *     <header>
 *       <Logo />
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // As a clickable link
 * function NavigationLogo() {
 *   return (
 *     <Link href="/" aria-label="Go to homepage">
 *       <Logo />
 *     </Link>
 *   );
 * }
 * ```
 *
 * @returns The logo component with branding elements
 */
export default function Logo() {
  return (
    <div className="flex items-center gap-4">
      {/* Icon container with gradient background */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
        <Shield
          className="h-5 w-5 text-primary-foreground"
          aria-hidden="true"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <span className="text-lg font-bold" aria-label="LawBotics">
          LawBotics
        </span>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Legal Document Analysis
        </span>
      </div>
    </div>
  );
}
