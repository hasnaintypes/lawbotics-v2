# LawBotics Library Utilities

This directory contains shared utility functions, chart helpers, and document utilities used throughout the LawBotics application. Each utility is designed to be reusable, well-documented, and follows best practices.

## Available Utilities

### General Utilities

#### `cn`

**Features:**

- Conditionally join class names using `clsx` and `tailwind-merge`.

**Usage:**

```tsx
import { cn } from "@/lib";
<div className={cn("p-4", isActive && "bg-primary")}>Content</div>;
```

**Return Value:**

- Returns a merged className string.

---

#### `dotProduct`

**Features:**

- Calculates the dot product of two numeric arrays.

**Usage:**

```ts
import { dotProduct } from "@/lib";
const result = dotProduct([1, 2, 3], [4, 5, 6]); // 32
```

**Return Value:**

- The dot product as a number.

---

#### `cleanAIResponseText`

**Features:**

- Cleans AI response text by removing Markdown code block markers (`json, `), making it ready for JSON parsing.

**Usage:**

```ts
import { cleanAIResponseText } from "@/lib";
const cleaned = cleanAIResponseText(rawText);
```

**Return Value:**

- The cleaned string.

---

### Chart Utilities

#### `getCssVarValue`

**Features:**

- Retrieves the value of a CSS custom property (variable) from the root document.

**Usage:**

```ts
import { getCssVarValue } from "@/lib";
const primary = getCssVarValue("--primary");
```

**Return Value:**

- The CSS variable value as a string.

---

#### `getChartColors`

**Features:**

- Returns an object of chart colors, resolving from CSS variables with fallbacks.

**Usage:**

```ts
import { getChartColors } from "@/lib";
const colors = getChartColors();
```

**Return Value:**

- An object of type `ChartColors`.

---

#### `useChartColors`

**Features:**

- Custom React hook for managing chart colors and updating them on theme changes.

**Usage:**

```tsx
import { useChartColors } from "@/lib";
const { chartColors, updateColors } = useChartColors();
```

**Return Value:**

- `{ chartColors, updateColors }`

---

#### `DEFAULT_CHART_COLORS` & `ChartColors`

**Features:**

- Default color palette and type for chart color objects.

**Usage:**

```ts
import { DEFAULT_CHART_COLORS } from "@/lib";
import type { ChartColors } from "@/lib";
const fallback: ChartColors = DEFAULT_CHART_COLORS;
```

---

### Date Utilities

#### `formatDateConsistent`

**Features:**

- Formats a timestamp into a consistent date string (`YYYY-MM-DD`) that works identically on both server and client to prevent hydration mismatches in Next.js.

**Usage:**

```ts
import { formatDateConsistent } from "@/lib";
const date = formatDateConsistent(Date.now()); // "2025-07-14"
```

**Return Value:**

- Formatted date string in `YYYY-MM-DD` format.

---

#### `formatDateFriendly`

**Features:**

- Formats a timestamp into a user-friendly date string (`MMM DD, YYYY`) consistent across server and client.

**Usage:**

```ts
import { formatDateFriendly } from "@/lib";
const date = formatDateFriendly(Date.now()); // "Jul 14, 2025"
```

**Return Value:**

- Formatted date string in `MMM DD, YYYY` format.

---

#### `formatDateForDisplay`

**Features:**

- Formats a timestamp for display in data tables and cards, using a readable and consistent format.

**Usage:**

```ts
import { formatDateForDisplay } from "@/lib";
const date = formatDateForDisplay(Date.now());
```

**Return Value:**

- Formatted date string (same as `formatDateFriendly`).

---

### Document Utilities

#### `DocumentEntry` & Types

**Features:**

- Type definitions for unified document/analysis entries and related types.

**Usage:**

```ts
import type { DocumentEntry, DocumentAction, SmartActions } from "@/lib";
```

---

#### `getRiskBadgeVariant`

**Features:**

- Returns the badge variant for a given risk score.

**Usage:**

```ts
import { getRiskBadgeVariant } from "@/lib";
const variant = getRiskBadgeVariant("85"); // "destructive"
```

---

#### `getStatusBadgeVariant`

**Features:**

- Returns the badge variant for a given document status.

**Usage:**

```ts
import { getStatusBadgeVariant } from "@/lib";
const variant = getStatusBadgeVariant("processing"); // "secondary"
```

---

#### `formatRiskScore`

**Features:**

- Formats a risk score string for display.

**Usage:**

```ts
import { formatRiskScore } from "@/lib";
const label = formatRiskScore("85"); // "85% High"
```

---

#### `navigateToDocument` / `navigateToAnalysis`

**Features:**

- Programmatic navigation helpers for document and analysis pages.

**Usage:**

```ts
import { navigateToDocument, navigateToAnalysis } from "@/lib";
navigateToDocument(router, entry);
navigateToAnalysis(router, entry);
```

---

#### `getDocumentId`

**Features:**

- Extracts the document ID from a document entry.

**Usage:**

```ts
import { getDocumentId } from "@/lib";
const id = getDocumentId(entry);
```

---

#### `getActionLabels`

**Features:**

- Returns context-aware action labels for UI.

**Usage:**

```ts
import { getActionLabels } from "@/lib";
const labels = getActionLabels(true);
```

---

#### `getSmartActions`

**Features:**

- Returns smart action configuration for a document entry.

**Usage:**

```ts
import { getSmartActions } from "@/lib";
const actions = getSmartActions(entry);
```

---

#### `handleSmartNavigation`

**Features:**

- Handles navigation based on a smart action.

**Usage:**

```ts
import { handleSmartNavigation } from "@/lib";
handleSmartNavigation(router, entry, "view_analysis");
```

---

#### `useDocumentDeletion`

**Features:**

- Custom hook for deleting documents and their analyses.

**Usage:**

```ts
import { useDocumentDeletion } from "@/lib";
const { deleteDocumentAndAnalyses } = useDocumentDeletion();
```

---

#### `documentUtils`

**Features:**

- Helper object for common document entry checks and display helpers.

**Usage:**

```ts
import { documentUtils } from "@/lib";
const isAnalyzed = documentUtils.isAnalyzed(entry);
```

---

## Best Practices

### 1. Import Patterns

```tsx
// Preferred: Named imports from index
import { cn, getChartColors, getRiskBadgeVariant } from "@/lib";

// Also acceptable: Direct imports
import { cn } from "@/lib/utils";
```

### 2. TypeScript Usage

```ts
import type { ChartColors, DocumentEntry } from "@/lib";
```

### 3. Extending Utilities

- When adding new utilities, ensure they are well-documented and exported from `index.ts`.
- Add usage and feature documentation here in the README.

---
