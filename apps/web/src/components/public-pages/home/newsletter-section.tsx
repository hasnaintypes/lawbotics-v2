import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Newsletter subscription section component
 *
 * Provides an email subscription form for users to receive updates
 * about legal technology insights, AI advancements, and exclusive tips.
 * Includes privacy policy acknowledgment and responsive form layout.
 *
 * @component
 * @returns {JSX.Element} The rendered newsletter section with header,
 *   description, subscription form, and privacy disclaimer
 *
 * @example
 * ```tsx
 * import { Newsletter } from "@/components/public/home"
 *
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <Features />
 *       <Newsletter />
 *     </main>
 *   )
 * }
 * ```
 *
 * @example
 * // Used in a footer or dedicated marketing section
 * <section className="newsletter-signup">
 *   <Newsletter />
 * </section>
 */
export default function Newsletter() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Stay Updated with Legal Tech Insights
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest in legal technology, AI
            advancements, and exclusive tips.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from LawBotics.
          </p>
        </div>
      </div>
    </section>
  );
}
