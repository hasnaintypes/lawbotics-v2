import { testimonials } from "@/constants/testimonials-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Testimonials section component displaying client success stories
 *
 * Showcases customer testimonials with alternating layout design,
 * featuring client avatars, quotes, and detailed benefits.
 * Each testimonial includes personal information, a quote,
 * headline, and a list of specific benefits achieved.
 *
 * @component
 * @returns {JSX.Element} The rendered testimonials section with header,
 *   description, and grid of testimonial cards in alternating layout
 *
 * @example
 * ```tsx
 * import { Testimonials } from "@/components/public/home"
 *
 * export default function HomePage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <Features />
 *       <Testimonials />
 *     </main>
 *   )
 * }
 * ```
 *
 * @example
 * // Used in a social proof section
 * <section className="social-proof">
 *   <Testimonials />
 * </section>
 */
export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Trusted by Legal Professionals
          </h2>
          <p className="text-lg text-muted-foreground">
            See how LawBotics is transforming legal document analysis for firms
            and individuals.
          </p>
        </div>

        <div className="grid gap-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col gap-8 md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 bg-muted/30 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-4 border-background">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-lg italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              <div className="flex-1 flex items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{testimonial.headline}</h3>
                  <p className="text-muted-foreground">{testimonial.detail}</p>
                  <ul className="space-y-2">
                    {testimonial.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary shrink-0 mt-0.5"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
