"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

/**
 * Convex client instance configuration
 *
 * Creates a singleton instance of the Convex client using the environment variable.
 * This client handles all database operations and real-time subscriptions.
 */
const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Props for the ConvexProvider component
 */
interface ConvexProviderProps {
  /** Child components that will have access to Convex context */
  children: React.ReactNode;
}

/**
 * Convex Client Provider Component
 *
 * A provider component that integrates Convex database with Clerk authentication.
 * This component enables real-time database operations with proper authentication
 * context throughout the application.
 *
 * Features:
 * - Real-time database operations via Convex
 * - Seamless Clerk authentication integration
 * - Automatic session management
 * - Type-safe database queries and mutations
 * - Real-time subscriptions and updates
 * - Optimistic updates support
 *
 * This provider should be placed after ClerkProvider but before any components
 * that need database access. It automatically handles authentication state
 * and provides the authenticated user context to Convex operations.
 *
 * @param props - Component props
 * @param props.children - Child components that will receive Convex context
 * @returns Convex provider with Clerk authentication integration
 *
 * @example
 * ```tsx
 * // Basic usage in root layout
 * function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <ClerkProvider>
 *       <ConvexProvider>
 *         {children}
 *       </ConvexProvider>
 *     </ClerkProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Usage in a component that needs database access
 * function DocumentList() {
 *   const documents = useQuery(api.documents.list);
 *   const createDocument = useMutation(api.documents.create);
 *
 *   return (
 *     <div>
 *       {documents?.map(doc => (
 *         <div key={doc._id}>{doc.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link https://docs.convex.dev/client/react} Convex React Documentation
 * @see {@link https://clerk.com/docs} Clerk Authentication Documentation
 */
export function ConvexProvider({ children }: ConvexProviderProps) {
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
