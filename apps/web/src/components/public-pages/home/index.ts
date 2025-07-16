/**
 * @fileoverview Public home page components for LawBotics landing page
 *
 * This barrel file exports all the main components used in the public-facing
 * homepage of the LawBotics application. These components work together to
 * create a comprehensive landing page experience showcasing the AI-powered
 * legal document analysis platform.
 *
 * @module components/public/home
 * @version 1.0.0
 * @since 2025-01-13
 */

// Component imports with kebab-case file naming convention
import Hero from "./hero-section";
import Features from "./features-section";
import Testimonials from "./testimonials-section";
import Newsletter from "./newsletter-section";
import FaqSection from "./faq-section";

/**
 * Hero section component - Main landing section with headline and CTAs
 * @see {@link ./hero-section.tsx}
 */
export { Hero };

/**
 * Features section component - Showcase of AI-powered legal tools
 * @see {@link ./features-section.tsx}
 */
export { Features };

/**
 * Testimonials section component - Client success stories and social proof
 * @see {@link ./testimonials-section.tsx}
 */
export { Testimonials };

/**
 * Newsletter section component - Email subscription form for updates
 * @see {@link ./newsletter-section.tsx}
 */
export { Newsletter };

/**
 * FAQ section component - Interactive accordion for common questions
 * @see {@link ./faq-section.tsx}
 */
export { FaqSection };
