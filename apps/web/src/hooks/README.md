# Hooks Documentation

This directory contains custom React hooks used throughout the LawBotics application. Each hook is designed to be reusable, well-documented, and follows React best practices.

## Available Hooks

### `useThemeToggle`

A custom hook for managing theme toggling functionality using next-themes.

**Features:**

- Toggle between light and dark themes
- Handle client-side hydration properly
- Prevent hydration mismatches
- Access to current theme state

**Usage:**

```tsx
import { useThemeToggle } from "@/hooks";

function ThemeButton() {
  const { mounted, resolvedTheme, toggleTheme } = useThemeToggle();

  if (!mounted) return null;

  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
```

**Return Values:**

- `resolvedTheme`: Current theme ('light' | 'dark' | 'system')
- `mounted`: Whether component has mounted (prevents hydration issues)
- `toggleTheme`: Function to toggle between light/dark themes
- `setTheme`: Function to set a specific theme

---

### `useScrollDetection`

A custom hook for detecting scroll position and scroll state.

**Features:**

- Detect when user scrolls past a threshold
- Optional scroll position tracking
- Configurable threshold
- Automatic cleanup of event listeners

**Usage:**

```tsx
import { useScrollDetection } from "@/hooks";

// Basic usage
function StickyHeader() {
  const { isScrolled } = useScrollDetection({ threshold: 50 });

  return (
    <header className={`transition-all ${isScrolled ? "shadow-lg" : ""}`}>
      Content
    </header>
  );
}

// With scroll position tracking
function ScrollIndicator() {
  const { isScrolled, scrollY } = useScrollDetection({
    threshold: 100,
    includeScrollY: true,
  });

  return (
    <div>
      <p>Scrolled: {isScrolled ? "Yes" : "No"}</p>
      <p>Position: {scrollY}px</p>
    </div>
  );
}
```

**Options:**

- `threshold`: Scroll threshold in pixels (default: 10)
- `includeScrollY`: Whether to track scroll position (default: false)

**Return Values:**

- `isScrolled`: Boolean indicating if scrolled past threshold
- `scrollY`: Current scroll position in pixels (if enabled)

---

### `useIsMobile`

A custom hook for detecting mobile device screen size using media queries.

**Features:**

- Detect mobile vs desktop screen sizes
- Responsive breakpoint at 768px
- Handle SSR/client-side rendering properly
- Automatic updates on viewport changes

**Usage:**

```tsx
import { useIsMobile } from "@/hooks";

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    // Still loading/SSR
    return <div>Loading...</div>;
  }

  return <div>{isMobile ? <MobileLayout /> : <DesktopLayout />}</div>;
}
```

**Return Values:**

- `boolean | undefined`: True if mobile, false if desktop, undefined during SSR

---

### `useAnalysis`

A custom hook for managing the document analysis workflow, including form state, API calls, error handling, and loading states.

**Features:**

- Manages analysis form state (party, custom party, bias)
- Handles loading and error states for analysis
- Submits analysis requests and navigates on success
- Provides extracted parties for selection
- Clean interface for UI components

**Usage:**

```tsx
import { useAnalysis } from "@/hooks";

function AnalysisForm({ documentId, onSuccess }) {
  const {
    formState,
    setFormState,
    isAnalyzing,
    error,
    loadingMessage,
    parties,
    handleSubmit,
    clearError,
    updateFormField,
  } = useAnalysis(documentId, onSuccess);

  // ...render form and handle UI
}
```

**Return Values:**

- `formState`: Current analysis form state ({ party, customParty, bias })
- `setFormState`: Function to update form state
- `isAnalyzing`: Boolean indicating if analysis is in progress
- `error`: Error message string or null
- `loadingMessage`: Current loading status message
- `parties`: Array of extracted parties for selection
- `handleSubmit`: Function to submit the analysis
- `clearError`: Function to clear error state
- `updateFormField`: Function to update a specific form field

**Parameters:**

- `documentId`: The ID of the document to analyze
- `onSuccess`: Optional callback when analysis starts successfully

---

### `useChartAnalytics`

A custom hook for managing dashboard chart analytics, fetching real-time analytics data and providing utilities for chart rendering and data validation.

**Features:**

- Fetches analytics data and stats for dashboard charts
- Checks if each chart has enough data to render
- Provides placeholder messages for empty charts
- Utility functions for each chart type

**Usage:**

```tsx
import { useChartAnalytics } from "@/hooks";

function DashboardCharts() {
  const {
    data,
    stats,
    isLoading,
    hasEnoughData,
    getPlaceholderMessage,
    shouldShowWeeklyActivity,
    shouldShowRiskDistribution,
    shouldShowDocumentVolume,
    shouldShowMonthlyAnalysis,
  } = useChartAnalytics();

  // ...render charts and handle loading/empty states
}
```

**Return Values:**

- `data`: Chart data object (weeklyActivity, riskDistribution, documentVolume, monthlyAnalysis)
- `stats`: Analytics stats (totalDocuments, totalAnalyses, avgRiskScore, recentActivity)
- `isLoading`: Boolean indicating if analytics data is loading
- `hasEnoughData`: Function to check if a chart has enough data
- `getPlaceholderMessage`: Function to get placeholder message for a chart
- `shouldShowWeeklyActivity`: Function to check if weekly activity chart should be shown
- `shouldShowRiskDistribution`: Function to check if risk distribution chart should be shown
- `shouldShowDocumentVolume`: Function to check if document volume chart should be shown
- `shouldShowMonthlyAnalysis`: Function to check if monthly analysis chart should be shown

**Types:**

- `WeeklyActivityData`, `RiskDistributionData`, `DocumentVolumeData`, `MonthlyAnalysisData`, `ChartData`

---

## Best Practices

### 1. Import Patterns

```tsx
// Preferred: Named imports from index
import { useThemeToggle, useScrollDetection } from "@/hooks";

// Also acceptable: Direct imports
import { useThemeToggle } from "@/hooks/use-theme-toggle";
```

### 2. Error Handling

```tsx
function Component() {
  const { mounted } = useThemeToggle();

  // Always check mounted state for client-only hooks
  if (!mounted) {
    return <div>Loading...</div>; // or appropriate fallback
  }

  // Render component
}
```

### 3. Performance Considerations

```tsx
// Use specific options to avoid unnecessary re-renders
const { isScrolled } = useScrollDetection({
  threshold: 100,
  includeScrollY: false, // Don't track position if not needed
});
```

### 4. TypeScript Usage

```tsx
import type { UseScrollDetectionOptions } from "@/hooks";

const scrollOptions: UseScrollDetectionOptions = {
  threshold: 50,
  includeScrollY: true,
};

const { isScrolled, scrollY } = useScrollDetection(scrollOptions);
```

## Contributing

When adding new hooks:

1. Create the hook file with proper JSDoc documentation
2. Export the hook and its types
3. Add it to the index.ts file
4. Update this README with usage examples
5. Write tests if applicable

### Hook Template

````tsx
"use client";

import { useState, useEffect } from "react";

/**
 * Interface for hook return value
 */
export interface UseCustomHookReturn {
  // Define return type properties
}

/**
 * Custom hook description
 *
 * Detailed description of what the hook does and when to use it.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const result = useCustomHook();
 *   return <div>{result}</div>;
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Hook return value
 */
export function useCustomHook(): UseCustomHookReturn {
  // Hook implementation
}
````
