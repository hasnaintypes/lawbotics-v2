# Public Home Components

This directory contains all the components used to build the public-facing homepage of the LawBotics application. These components work together to create a compelling landing page experience that showcases the AI-powered legal document analysis platform.

## Directory Structure

```
home/
├── README.md                    # This documentation file
├── index.ts                     # Barrel export file for all components
├── hero-section.tsx             # Main hero section with headlines and CTAs
├── features-section.tsx         # AI tools showcase grid
├── testimonials-section.tsx     # Client success stories
├── newsletter-section.tsx       # Email subscription form
└── faq-section.tsx             # Interactive FAQ accordion
```

## Components Overview

### Hero Section (`hero-section.tsx`)

The main landing section featuring:

- **Compelling headline** with AI intelligence branding
- **Dual call-to-action buttons** (Get Started Free / See Demo)
- **Three key value propositions** with icons:
  - Secure Analysis - Document security emphasis
  - Legal Precision - Expert-built credibility
  - Continuous Learning - AI improvement messaging
- **Gradient background** for visual appeal
- **Responsive design** across all device sizes

**Key Features:**

- Primary and secondary CTAs with proper routing
- Icon-based value proposition display
- Centered layout with maximum width constraints
- Accessible button implementations

### Features Section (`features-section.tsx`)

Showcases the platform's AI-powered tools:

- **Dynamic icon mapping** system for feature visualization
- **Grid layout** (1-2-3 columns responsive)
- **Feature cards** with hover effects and shadows
- **Learn more links** with arrow indicators
- **Data-driven content** from constants file

**Supported Icons:**

- `risk-analysis` → AlertCircle (Risk Analysis)
- `chat` → MessageSquare (Document Chat)
- `search` → Search (Legal Search)
- `drafter` → FileText (Document Drafter)
- `analytics` → BarChart3 (Legal Analytics)

**Key Features:**

- Modular icon system with fallback handling
- Consistent card design with primary color accents
- Hover interactions for improved UX
- External data source integration

### Testimonials Section (`testimonials-section.tsx`)

Displays client success stories and social proof:

- **Alternating layout design** (left-right, right-left)
- **Avatar integration** with fallback initials
- **Structured testimonial data** including:
  - Client photo and personal information
  - Testimonial quote with proper typography
  - Headline and detailed description
  - Bullet-pointed benefits list
- **Three featured testimonials** from data source
- **Checkmark icons** for benefit highlights

**Key Features:**

- Avatar component with image fallback system
- Responsive flexbox layout with directional alternation
- Semantic HTML structure for accessibility
- Visual hierarchy with proper typography scales

### Newsletter Section (`newsletter-section.tsx`)

Email subscription functionality:

- **Responsive form layout** (stacked on mobile, inline on desktop)
- **Email input validation** with required attribute
- **Privacy policy acknowledgment** text
- **Consistent button styling** with other CTAs
- **Centered content** with maximum width constraints

**Key Features:**

- Form accessibility with proper labels and requirements
- Responsive flex layout adaptation
- Legal compliance messaging
- Consistent design system integration

### FAQ Section (`faq-section.tsx`)

Interactive frequently asked questions:

- **Accordion-style interface** with smooth animations
- **Single-open policy** (only one FAQ open at a time)
- **Icon state management** (Plus/Minus toggle)
- **Smooth height transitions** with CSS classes
- **Keyboard accessibility** with ARIA attributes
- **Data-driven content** from constants file

**Key Features:**

- Client-side state management for interactions
- CSS transition animations for smooth UX
- ARIA expanded attributes for screen readers
- Responsive design with proper spacing
- Utility class composition for styling

## Usage Examples

### Basic Implementation

```tsx
import {
  Hero,
  Features,
  Testimonials,
  Newsletter,
  FaqSection,
} from "@/components/public/home";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <Testimonials />
      <FaqSection />
      <Newsletter />
    </main>
  );
}
```

### Individual Component Usage

```tsx
// Using just the hero section
import { Hero } from "@/components/public/home";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      {/* Other content */}
    </div>
  );
}
```

### Custom Layout Implementation

```tsx
import { Hero, Features } from "@/components/public/home";

export default function CustomPage() {
  return (
    <div className="custom-layout">
      <section className="hero-wrapper">
        <Hero />
      </section>

      <section className="features-wrapper bg-muted">
        <Features />
      </section>
    </div>
  );
}
```

## Data Dependencies

The components rely on external data sources for content:

### Required Constants Files

- `@/constants/features-section` - Feature data with icons, titles, descriptions
- `@/constants/testimonials-section` - Client testimonial data and benefits
- `@/constants/faq-section` - FAQ questions and answers array

### Expected Data Structures

```typescript
// features_section.ts
interface Feature {
  icon: string;
  title: string;
  description: string;
}

// testimonials-section.ts
interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  headline: string;
  detail: string;
  benefits: string[];
}

// faq-section.ts
interface FAQ {
  question: string;
  answer: string;
}
```

## Styling Approach

### Design System Integration

- **Tailwind CSS v4** with design tokens
- **CSS variables** for consistent theming
- **Responsive design** with mobile-first approach
- **Design system components** from `@/components/ui`

### Color Palette Usage

- `primary` - Brand color for CTAs and accents
- `muted` - Background variations and subtle elements
- `muted-foreground` - Secondary text content
- `background` - Main background colors

### Typography Scale

- `text-4xl/5xl/6xl` - Hero headlines (responsive)
- `text-3xl/4xl` - Section headlines
- `text-xl` - Subheadings and important content
- `text-lg` - Body text and descriptions
- `text-sm/xs` - Secondary information and disclaimers

## Accessibility Features

### Semantic HTML

- Proper heading hierarchy (`h1`, `h2`, `h3`)
- Section landmarks for screen readers
- Form labels and requirements
- Button and link accessibility

### ARIA Implementation

- `aria-expanded` for accordion states
- `alt` attributes for images
- `role` attributes where appropriate
- Keyboard navigation support

### Focus Management

- Visible focus indicators
- Logical tab order
- Skip links where applicable
- Keyboard event handling

## Performance Considerations

### Optimization Strategies

- **Component lazy loading** ready (use dynamic imports if needed)
- **Image optimization** with Next.js Image component
- **CSS class optimization** with Tailwind's purge system
- **External data caching** for constants

### Bundle Size Impact

- Minimal external dependencies
- Tree-shakeable icon imports from Lucide React
- Efficient component composition
- Optimized CSS class usage

## Testing Recommendations

### Unit Testing

```typescript
// Example test structure
describe("Hero Component", () => {
  it("renders headline and CTAs", () => {
    // Test implementation
  });

  it("displays value propositions with icons", () => {
    // Test implementation
  });
});
```

### Integration Testing

- Full page rendering with all components
- Navigation between CTA links
- Form submission handling
- Responsive design validation

### Accessibility Testing

- Screen reader compatibility
- Keyboard navigation flow
- Color contrast validation
- Focus indicator visibility

## Maintenance Guidelines

### Content Updates

1. **Feature changes**: Update `@/constants/features_section`
2. **Testimonial updates**: Modify `@/constants/testimonials-section`
3. **FAQ updates**: Edit `@/constants/faq-section`
4. **Copy changes**: Direct component file editing

### Adding New Components

1. Create component file with kebab-case naming
2. Add comprehensive JSDoc documentation
3. Export from `index.ts` with documentation
4. Update this README with component details
5. Add to page implementation

### Design System Updates

1. Update color variables in theme configuration
2. Modify typography scales in Tailwind config
3. Test component rendering with new tokens
4. Update documentation examples

## Related Documentation

- [Shared Components](../shared/README.md) - Reusable UI components
- [Layout Components](../../layout/README.md) - Page structure components
- [Constants Documentation](../../../constants/README.md) - Data source files

## Version History

- **v1.0.0** (2025-01-13): Initial implementation with comprehensive JSDoc documentation
  - Hero section with gradient background and value propositions
  - Features grid with dynamic icon mapping
  - Testimonials with alternating layout
  - Newsletter subscription form
  - Interactive FAQ accordion
  - Proper TypeScript types and accessibility features
