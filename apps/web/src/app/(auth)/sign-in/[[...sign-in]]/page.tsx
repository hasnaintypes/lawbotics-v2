import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your LawBotics account to access AI-powered legal document analysis.",
};

export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors",
              card: "shadow-lg border bg-background",
              headerTitle: "text-2xl font-bold text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border hover:bg-accent transition-colors",
              formFieldInput: "border-border bg-background text-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
        />
      </div>
    </div>
  );
}
