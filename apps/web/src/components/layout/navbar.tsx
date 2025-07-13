"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoonStar, Sun } from "lucide-react";
import Logo from "@/components/shared/logo";
import { SignInButton } from "@clerk/nextjs";

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-200",
        scrolled && "border-b"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center space-x-2">
            <Logo />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-1 rounded-md"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <MoonStar className="h-5 w-5" />
            )}
          </button>

          <SignInButton mode="modal">
            <Button className="rounded-full">Get Started</Button>
          </SignInButton>
        </div>
      </div>
    </header>
  );
}
