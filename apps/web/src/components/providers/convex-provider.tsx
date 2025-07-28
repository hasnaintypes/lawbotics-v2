"use client";

import React, { useEffect } from "react";
import { ClerkProvider, useAuth, useSession } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ConvexProviderProps {
  children: React.ReactNode;
}

function ConvexAuthProvider({ children }: ConvexProviderProps) {
  const { getToken } = useAuth();

  useEffect(() => {
    convex.setAuth(async () => {
      const token = await getToken({ template: "convex" }); // Template name must match what you set in Clerk
      console.log("Convex token?", token);
      return token ?? null;
    });
  }, [getToken]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexAuthProvider>{children}</ConvexAuthProvider>
    </ClerkProvider>
  );
}
