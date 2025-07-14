/**
 * Hooks module - Custom React hooks for LawBotics application
 *
 * This module exports all custom hooks used throughout the application.
 * Each hook is designed to be reusable and follows React best practices.
 *
 * @fileoverview Central export file for all custom React hooks
 */

export { useIsMobile } from "./use-mobile";
export { useThemeToggle } from "./use-theme-toggle";
export { useScrollDetection } from "./use-scroll-detection";
export { useAnalysis } from "./use-analysis";
export { useChartAnalytics } from "./use-chart-analytics";

/**
 * Re-export types for better developer experience
 */
export type { UseThemeToggleReturn } from "./use-theme-toggle";
export type {
  UseScrollDetectionReturn,
  UseScrollDetectionOptions,
} from "./use-scroll-detection";
export type { AnalysisFormState } from "./use-analysis";
export type {
  WeeklyActivityData,
  RiskDistributionData,
  DocumentVolumeData,
  MonthlyAnalysisData,
  ChartData,
} from "./use-chart-analytics";
