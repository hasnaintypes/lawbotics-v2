import type { MetadataRoute } from "next";

/**
 * Web App Manifest Configuration
 *
 * Defines the Progressive Web App (PWA) manifest for LawBotics, enabling
 * the application to be installed on devices and providing native app-like
 * experience across different platforms.
 *
 * The manifest includes app metadata, display preferences, theme colors,
 * and icon configurations for various device sizes and contexts.
 *
 * Features:
 * - PWA installation capability
 * - Standalone app display mode
 * - Custom theme colors matching brand identity
 * - Multiple icon sizes for different contexts
 * - Comprehensive app metadata
 * - Optimized for legal professional workflows
 *
 * @returns Web app manifest configuration object
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest} Next.js Manifest Documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest} Web App Manifest Specification
 *
 * @example
 * ```tsx
 * // This file is automatically processed by Next.js
 * // The manifest is served at /manifest.json
 *
 * // Users can install the app by:
 * // 1. Visiting the site in a compatible browser
 * // 2. Clicking "Add to Home Screen" or similar browser prompt
 * // 3. Using the browser's install functionality
 * ```
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // App Identity
    name: "LawBotics - AI Legal Document Analysis",
    short_name: "LawBotics",
    description:
      "AI-powered legal document analysis and management for legal professionals and individuals",

    // PWA Configuration
    start_url: "/",
    display: "standalone",

    // Theme Configuration
    background_color: "#ffffff", // Light theme background
    theme_color: "#7c3aed", // Primary purple brand color

    // App Icons - Multiple sizes for different contexts
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // Suitable for adaptive icons
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", // High-resolution icon for splash screens
      },
    ],

    // Additional PWA Enhancements
    orientation: "any", // Support both portrait and landscape
    scope: "/", // Define the scope of the PWA

    // Categories for app stores
    categories: ["productivity", "business", "utilities"],
  };
}
