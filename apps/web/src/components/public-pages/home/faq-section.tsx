"use client";

import { useState } from "react";
import { faqs } from "@/constants/faq-section";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

/**
 * FAQ (Frequently Asked Questions) section component
 *
 * Interactive accordion-style FAQ display with expandable/collapsible
 * question and answer pairs. Uses state management to track which
 * FAQ item is currently open, allowing only one item to be expanded
 * at a time for better user experience.
 *
 * @component
 * @returns {JSX.Element} The rendered FAQ section with interactive
 *   expandable question and answer pairs
 *
 * @example
 * ```tsx
 * import { FaqSection } from "@/components/public/home"
 *
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <Features />
 *       <FaqSection />
 *     </main>
 *   )
 * }
 * ```
 *
 * @example
 * // Used in a help or support page
 * <section className="help-section">
 *   <FaqSection />
 * </section>
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-md border bg-background shadow-sm overflow-hidden"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="flex w-full items-center justify-between p-6 text-left"
            aria-expanded={openIndex === index}
          >
            <h3 className="text-lg font-medium">{faq.question}</h3>
            <span className="ml-2 flex-shrink-0 text-primary">
              {openIndex === index ? (
                <Minus className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </span>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="p-6 pt-0 text-muted-foreground">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
