# Providers Documentation

This directory contains all provider components that wrap the application with essential contexts and functionality. These providers enable features like authentication integration, theme management, database connectivity, and other global application state.

## Provider Components

### `ThemeProvider`

A wrapper around next-themes that provides theme switching functionality throughout the application.

**Features:**

- Light and dark theme support
- System preference detection and following
- Theme persistence across browser sessions
- Smooth theme transitions (configurable)
- SSR-safe hydration handling
- Custom theme attribute support

**Configuration Options:**

- `attribute` - HTML attribute for theme switching (default: "class")
- `defaultTheme` - Default theme when no preference is set
- `enableSystem` - Enable automatic system theme detection
- `disableTransitionOnChange` - Disable CSS transitions during theme switches
- `themes` - Array of available theme options

**Usage:**

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

---

### `ConvexProvider`

Integrates Convex real-time database with Clerk authentication, providing authenticated database access throughout the application.

**Features:**

- Real-time database operations via Convex
- Seamless Clerk authentication integration
- Automatic session management
- Type-safe database queries and mutations
- Real-time subscriptions and live updates
- Optimistic updates support
- Automatic reconnection handling

**Environment Requirements:**

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL

**Usage:**

```tsx
<ConvexProvider>{children}</ConvexProvider>
```

**In Components:**

```tsx
function DocumentList() {
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);

  return (
    <div>{documents?.map((doc) => <div key={doc._id}>{doc.title}</div>)}</div>
  );
}
```

---

## Provider Hierarchy & Setup

### Recommended Provider Order

Providers should be nested in the correct order for proper functionality:

```tsx
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>           {/* 1. Authentication (outermost) */}
      <html lang="en">
        <body>
          <ThemeProvider        {/* 2. Theme management */}
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <ConvexProvider>    {/* 3. Database with auth context */}
              {children}
            </ConvexProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Why This Order Matters

1. **ClerkProvider First**: Provides authentication context needed by ConvexProvider
2. **ThemeProvider Second**: Manages theme state independently of other providers
3. **ConvexProvider Third**: Requires authentication context from ClerkProvider
4. **Additional Providers**: Can be added inside or outside based on dependencies

---

## Best Practices

### 1. Environment Variables

```bash
# Required for ConvexProvider
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Required for ClerkProvider (external)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### 2. Type Safety

```tsx
// All providers include proper TypeScript interfaces
interface ConvexProviderProps {
  children: React.ReactNode;
}

// Use proper typing when extending providers
interface CustomProviderProps extends ConvexProviderProps {
  customProp: string;
}
```

### 3. Error Handling

```tsx
// Providers include error boundaries and fallbacks
function ConvexProvider({ children }: ConvexProviderProps) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is required");
  }

  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

### 4. Performance Considerations

```tsx
// Theme provider disables transitions for better performance
<ThemeProvider disableTransitionOnChange>{children}</ThemeProvider>;

// Convex client is a singleton to prevent recreation
const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
```

---

## Integration Examples

### With Custom Hooks

```tsx
// Custom hook that uses multiple provider contexts
function useAppState() {
  const { user } = useUser(); // From ClerkProvider
  const { theme } = useTheme(); // From ThemeProvider
  const documents = useQuery(api.documents.list); // From ConvexProvider

  return { user, theme, documents };
}
```

### With Page Components

```tsx
// Page component using provider contexts
export default function DashboardPage() {
  const documents = useQuery(api.documents.list);
  const { user } = useUser();

  if (!user) {
    return <LoadingSpinner title="Loading user..." />;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {documents?.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
    </div>
  );
}
```

---

## Adding New Providers

When adding new provider components:

### 1. Create the Provider

```tsx
"use client";

import React from "react";

interface YourProviderProps {
  children: React.ReactNode;
}

/**
 * Your Provider Component
 *
 * Description of what this provider does and why it's needed.
 *
 * Features:
 * - List key features
 * - Include integration notes
 * - Mention dependencies
 *
 * @param props - Component props
 * @returns Provider component
 */
export function YourProvider({ children }: YourProviderProps) {
  return (
    <YourContext.Provider value={contextValue}>{children}</YourContext.Provider>
  );
}
```

### 2. Add to Index

```tsx
// Add export to index.ts
export { YourProvider } from "./your-provider";
```

### 3. Update Layout

```tsx
// Add to provider hierarchy in layout.tsx
<ConvexProvider>
  <YourProvider>{children}</YourProvider>
</ConvexProvider>
```

### 4. Document Usage

- Update this README with usage examples
- Add JSDoc documentation to the component
- Include TypeScript interfaces
- Add error handling and validation

---

## Troubleshooting

### Common Issues

**Theme flashing on load:**

```tsx
// Add suppressHydrationWarning to html element
<html lang="en" suppressHydrationWarning>
```

**Convex authentication errors:**

```tsx
// Ensure ClerkProvider wraps ConvexProvider
<ClerkProvider>
  <ConvexProvider>{children}</ConvexProvider>
</ClerkProvider>
```

**Environment variable errors:**

```bash
# Check all required environment variables are set
NEXT_PUBLIC_CONVEX_URL=https://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

### Performance Optimization

**Theme provider optimization:**

```tsx
<ThemeProvider disableTransitionOnChange>
  {/* Disables CSS transitions during theme change */}
</ThemeProvider>
```

**Convex client optimization:**

```tsx
// Create client outside component to prevent recreation
const convexClient = new ConvexReactClient(url);
```
