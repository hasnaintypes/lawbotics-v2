import type { Metadata } from "next";
import {
  Hero,
  Features,
  Testimonials,
  Newsletter,
  FaqSection,
} from "@/components/public_pages";
import { AuthenticatedRedirect } from "@/components/shared";

export const metadata: Metadata = {
  title: "LawBotics - AI-Powered Legal Document Analysis",
  description:
    "Analyze legal documents, chat with contracts, and draft agreements with our AI-powered legal assistant.",
};

export default function Home() {
  return (
    <>
      <AuthenticatedRedirect />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
    </>
  );
}
