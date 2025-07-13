// React & Next.js imports
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Third-party providers
import { ClerkProvider } from "@clerk/nextjs";

// Styles
import "./globals.css";

// Internal providers
import { ThemeProvider, ConvexProvider } from "@/components/providers";

// UI Components
import { Toaster } from "@/components/ui/sonner";

/**
 * Application Metadata Configuration
 *
 * Defines SEO and social media metadata for the application.
 * This metadata is used by search engines, social platforms, and browsers
 * to display information about the application.
 */
export const metadata: Metadata = {
  title: {
    default: "LawBotics - AI Legal Document Analysis",
    template: "%s | LawBotics",
  },
  description:
    "AI-powered legal document analysis and management for legal professionals and individuals",
  keywords: [
    "legal",
    "document analysis",
    "AI",
    "law",
    "contract review",
    "legal tech",
  ],
  authors: [{ name: "LawBotics Team" }],
  creator: "LawBotics",
  publisher: "LawBotics",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lawbotics.com",
    title: "LawBotics - AI Legal Document Analysis",
    description:
      "AI-powered legal document analysis and management for legal professionals and individuals",
    siteName: "LawBotics",
  },
  twitter: {
    card: "summary_large_image",
    title: "LawBotics - AI Legal Document Analysis",
    description:
      "AI-powered legal document analysis and management for legal professionals and individuals",
    creator: "@lawbotics",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

/**
 * Font Configuration
 *
 * Configures the Inter font family with Latin subset for optimal performance
 * and consistent typography throughout the application.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Improves font loading performance
});

/**
 * Props for the RootLayout component
 */
interface RootLayoutProps {
  /** Child components and pages to be rendered within the layout */
  children: React.ReactNode;
}

/**
 * Root Layout Component
 *
 * The top-level layout component that wraps all pages and provides essential
 * application-wide functionality including authentication, theming, database
 * connectivity, and global UI components.
 *
 * Provider Hierarchy:
 * 1. ClerkProvider - Authentication and user management
 * 2. ThemeProvider - Light/dark theme switching and persistence
 * 3. ConvexProvider - Real-time database with authenticated context
 * 4. Toaster - Global notification system
 *
 * Features:
 * - Global font configuration (Inter)
 * - Authentication state management via Clerk
 * - Theme switching with system preference detection
 * - Real-time database connectivity via Convex
 * - Global notification system via Sonner
 * - Hydration-safe rendering
 * - SEO-optimized HTML structure
 *
 * @param props - Layout component props
 * @param props.children - The page content to be rendered
 * @returns The root layout with all providers and global components
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in the app directory
 * // No manual usage required - Next.js handles this automatically
 *
 * // Pages are rendered as children:
 * function HomePage() {
 *   return <div>Home page content</div>;
 * }
 *
 * // Final structure becomes:
 * // <RootLayout>
 * //   <HomePage />
 * // </RootLayout>
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts} Next.js Layout Documentation
 * @see {@link https://clerk.com/docs/quickstarts/nextjs} Clerk Next.js Setup
 * @see {@link https://docs.convex.dev/client/react} Convex React Integration
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexProvider>{children}</ConvexProvider>
          </ThemeProvider>

          {/* Global notification system */}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
