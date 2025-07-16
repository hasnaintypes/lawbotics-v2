# Shared Components Documentation

This directory contains all shared/reusable components used throughout the LawBotics application. These components provide common functionality, maintain design consistency, and improve development efficiency.

## Component Categories

### Authentication & Navigation

#### `AuthenticatedRedirect`

Automatically redirects authenticated users to the dashboard from public pages.

**Features:**

- Client-side authentication detection
- Smooth redirect with loading state
- Prevents flash of public content
- Console logging for debugging

**Usage:**

```tsx
// Place at the top of public pages
export default function HomePage() {
  return (
    <>
      <AuthenticatedRedirect />
      <main>
        <HeroSection />
      </main>
    </>
  );
}
```

#### `Logo`

The main application branding component with responsive design.

**Features:**

- Gradient shield icon
- Company name and tagline
- Responsive visibility
- Accessible markup

**Usage:**

```tsx
// In navigation or headers
<Link href="/" aria-label="Go to homepage">
  <Logo />
</Link>
```

#### `ModeToggle`

Theme switching component using custom theme hook.

**Features:**

- Light/dark theme toggle
- Smooth icon transitions
- Proper accessibility
- Hydration-safe rendering

**Usage:**

```tsx
// In navigation or settings
<div className="flex items-center gap-4">
  <Logo />
  <ModeToggle />
</div>
```

---

### Loading States

#### `LoadingSpinner`

Customizable loading spinner with dual-ring animation and informative text.

**Props:**

- `title` - Main loading message (default: "Loading")
- `description` - Contextual description (default: "Please wait")
- `subtitle` - Additional information
- `size` - "sm" | "md" | "lg" (default: "md")
- `showDots` - Show animated dots (default: true)

**Usage:**

```tsx
// Basic usage
<LoadingSpinner />

// Custom messaging
<LoadingSpinner
  title="Processing Document"
  description="Analyzing content"
  subtitle="This may take a few moments"
  size="lg"
/>
```

#### `FullPageLoader`

Full-page loading layout with optional navigation header.

**Features:**

- Complete viewport coverage
- Optional navigation placeholder
- All LoadingSpinner features
- Proper backdrop handling

**Usage:**

```tsx
// Page-level loading
<FullPageLoader
  showNavigation={true}
  title="Loading Dashboard"
  description="Preparing your data"
/>
```

---

### Skeleton Placeholders

#### `Skeleton`

Basic skeleton element for building custom loading layouts.

**Props:**

- `className` - Custom CSS classes
- `animate` - Enable pulse animation (default: true)

**Usage:**

```tsx
// Basic shapes
<Skeleton className="h-4 w-32" />
<Skeleton className="h-12 w-12 rounded-full" />

// Without animation
<Skeleton className="h-6 w-48" animate={false} />
```

#### `DocumentCardSkeleton`

Document card loading placeholder with structured layout.

**Usage:**

```tsx
// Document grid loading
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {Array.from({ length: 6 }).map((_, index) => (
    <DocumentCardSkeleton key={index} />
  ))}
</div>
```

#### `AnalyticsCardSkeleton`

Analytics card placeholder for metrics and charts.

**Usage:**

```tsx
// Analytics dashboard loading
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {Array.from({ length: 4 }).map((_, index) => (
    <AnalyticsCardSkeleton key={index} />
  ))}
</div>
```

#### `TableRowSkeleton`

Table row placeholder with configurable columns.

**Props:**

- `columns` - Number of columns (default: 5)

**Usage:**

```tsx
// Table loading state
<table>
  <tbody>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRowSkeleton key={index} columns={4} />
    ))}
  </tbody>
</table>
```

#### `DashboardSkeleton`

Complete dashboard page skeleton with all sections.

**Usage:**

```tsx
// Dashboard page loading
function DashboardPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return <DashboardContent />;
}
```

---

## Import Patterns

### Recommended Imports

```tsx
// Import from index for clean imports
import {
  LoadingSpinner,
  Logo,
  ModeToggle,
  DocumentCardSkeleton,
} from "@/components/shared";
```

### Direct Imports

```tsx
// Direct imports when needed
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import Logo from "@/components/shared/logo";
```

---

## Best Practices

### 1. Loading States

```tsx
// Always provide meaningful loading messages
<LoadingSpinner
  title="Processing Document"
  description="Analyzing legal clauses"
  subtitle="This process may take up to 30 seconds"
/>

// Use appropriate sizes for context
<LoadingSpinner size="sm" title="Saving..." />  // Inline actions
<LoadingSpinner size="lg" title="Loading App" /> // Page loads
```

### 2. Skeleton Usage

```tsx
// Match skeleton structure to actual content
function DocumentCard({ loading, document }) {
  if (loading) {
    return <DocumentCardSkeleton />;
  }

  return (
    <div className="border rounded-lg p-6">
      <h3>{document.title}</h3>
      <p>{document.description}</p>
    </div>
  );
}
```

### 3. Accessibility

```tsx
// Components include proper ARIA attributes
<LoadingSpinner title="Loading" /> // Includes role="status" aria-live="polite"
<Skeleton className="h-4 w-32" />  // Includes aria-hidden="true"
```

### 4. Theme Integration

```tsx
// All components respect theme variables
// Use ModeToggle with custom theme hook for consistency
<ModeToggle /> // Uses useThemeToggle hook internally
```

---

## Component Dependencies

### Internal Dependencies

- Custom hooks: `useThemeToggle` from `@/hooks`
- Utility functions: `cn` from `@/lib/utils`
- UI components: Clerk components for authentication

### External Dependencies

- `lucide-react` - Icons (Shield, Sun, MoonStar)
- `@clerk/nextjs` - Authentication components
- `next/navigation` - Client-side routing

---

## Contributing

When adding new shared components:

1. **Create the component** with proper JSDoc documentation
2. **Add exports** to the index.ts file with categorization
3. **Update this README** with usage examples
4. **Include accessibility** attributes (ARIA, roles, etc.)
5. **Test responsiveness** across different screen sizes
6. **Ensure theme compatibility** with light/dark modes

### Component Template

````tsx
import * as React from "react";

/**
 * Props for YourComponent
 */
interface YourComponentProps {
  /** Prop description */
  propName?: string;
}

/**
 * YourComponent
 *
 * Brief description of what the component does.
 *
 * Features:
 * - List key features
 * - Include accessibility notes
 * - Mention responsive behavior
 *
 * @param props - Component props
 * @returns Component description
 *
 * @example
 * ```tsx
 * <YourComponent propName="value" />
 * ```
 */
export function YourComponent({ propName }: YourComponentProps) {
  return (
    <div role="presentation" aria-hidden="true">
      {/* Component implementation */}
    </div>
  );
}
````
