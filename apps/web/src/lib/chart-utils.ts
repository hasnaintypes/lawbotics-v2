import * as React from "react";

/**
 * Chart utility functions
 *
 * Provides utility functions for chart styling, color management,
 * and theme integration across dashboard components.
 */

/**
 * Utility function to get CSS custom property values
 *
 * @param variableName - The CSS variable name to retrieve (e.g., "--primary")
 * @returns The CSS variable value or empty string if not available
 *
 * @example
 * ```ts
 * const primaryColor = getCssVarValue("--primary");
 * const chartColor1 = getCssVarValue("--chart-1");
 * ```
 */
export function getCssVarValue(variableName: string): string {
  if (typeof window === "undefined") return "";

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

/**
 * Chart color configuration interface
 */
export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  primary: string;
  background: string;
  border: string;
}

/**
 * Default fallback colors for charts
 */
export const DEFAULT_CHART_COLORS: ChartColors = {
  chart1: "#8884d8",
  chart2: "#82ca9d",
  chart3: "#ffc658",
  chart4: "#ff7300",
  chart5: "#a4de6c",
  primary: "#6366f1",
  background: "#fff",
  border: "#e5e7eb",
};

/**
 * Gets chart colors from CSS variables with fallbacks
 *
 * @returns ChartColors object with resolved values
 */
export function getChartColors(): ChartColors {
  return {
    chart1: getCssVarValue("--chart-1") || DEFAULT_CHART_COLORS.chart1,
    chart2: getCssVarValue("--chart-2") || DEFAULT_CHART_COLORS.chart2,
    chart3: getCssVarValue("--chart-3") || DEFAULT_CHART_COLORS.chart3,
    chart4: getCssVarValue("--chart-4") || DEFAULT_CHART_COLORS.chart4,
    chart5: getCssVarValue("--chart-5") || DEFAULT_CHART_COLORS.chart5,
    primary: getCssVarValue("--primary") || DEFAULT_CHART_COLORS.primary,
    background:
      getCssVarValue("--background") || DEFAULT_CHART_COLORS.background,
    border: getCssVarValue("--border") || DEFAULT_CHART_COLORS.border,
  };
}

/**
 * Custom hook for managing chart colors with theme updates
 *
 * @returns Object with current colors and update function
 */
export function useChartColors() {
  const [chartColors, setChartColors] =
    React.useState<ChartColors>(DEFAULT_CHART_COLORS);

  const updateColors = React.useCallback(() => {
    setChartColors(getChartColors());
  }, []);

  React.useEffect(() => {
    updateColors();
    window.addEventListener("themechange", updateColors);
    return () => window.removeEventListener("themechange", updateColors);
  }, [updateColors]);

  return { chartColors, updateColors };
}
