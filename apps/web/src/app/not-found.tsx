import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-20">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>
        <p className="mt-4 text-xl text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>
        <div className="mt-8">
          <Button asChild className="rounded-full">
            <Link href="/dashboard">Return Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
