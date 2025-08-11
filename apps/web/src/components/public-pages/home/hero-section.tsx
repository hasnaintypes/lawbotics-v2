import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Scale, Shield } from "lucide-react";

/**
 * Hero section component for the LawBotics homepage
 *
 * Features a compelling headline, call-to-action buttons, and key value propositions
 * with icons showcasing the platform's core benefits: security, legal precision,
 * and continuous AI learning capabilities.
 *
 * @component
 * @returns {JSX.Element} The rendered hero section with background gradient,
 *   main content, CTAs, and feature highlights
 *
 * @example
 * ```tsx
 * import { Hero } from "@/components/public/home"
 *
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *     </main>
 *   )
 * }
 * ```
 *
 * @example
 * // Used within a landing page layout
 * <section>
 *   <Hero />
 *   <Features />
 *   <Testimonials />
 * </section>
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              AI-Powered Legal Analysis
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Transform Legal Documents with{" "}
            <span className="text-primary">AI Intelligence</span>
          </h1>

          <p className="mb-10 text-xl text-muted-foreground">
            Analyze contracts, extract insights, and manage legal documents with
            precision and confidence using our advanced AI technology.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row cursor-pointer">
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">See Demo</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Secure Analysis",
                description:
                  "Your documents never leave our secure environment",
              },
              {
                icon: <Scale className="h-6 w-6 text-primary" />,
                title: "Legal Precision",
                description: "Built by legal experts for legal professionals",
              },
              {
                icon: <GraduationCap className="h-6 w-6 text-primary" />,
                title: "Continuous Learning",
                description: "Our AI improves with every document analyzed",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-medium">{item.title}</h3>
                <p className="text-center text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
