import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Out",
  description: "Sign out of your LawBotics account.",
};

export default function SignOutPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md text-center space-y-6 p-8 border rounded-lg shadow-lg bg-background">
        <h1 className="text-2xl font-bold text-foreground">Sign Out</h1>
        <p className="text-muted-foreground">
          Are you sure you want to sign out of your account?
        </p>
        <div className="flex gap-4 justify-center">
          <SignOutButton>
            <Button variant="destructive">
              Sign Out
            </Button>
          </SignOutButton>
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
