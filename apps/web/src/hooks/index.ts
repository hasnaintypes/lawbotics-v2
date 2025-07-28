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
export { useDocumentChat } from "./use-document-chat";
export { useUnifiedDocuments } from "./use-unified-document";
export { useDocumentAnalysis } from "./use-document-analysis";
export { useDocumentTable } from "./use-document-table";
export { usePagination, calculateTotalPages } from "./use-pagination";
export { useDashboardAnalytics } from "./use-dashboard-analytics";
export { useFormattedUser } from "./use-formatted-user";
export { useAnalysisFetch } from "./use-analysis-fetch";
export { useChat } from "./use-chat";
export { useContractAnalytics } from "./use-contract-analytics";
export { useContracts } from "./use-contracts";
export { usePdfGeneration } from "./use-pdf-generation";
export { useContractCreation } from "./use-contract-creation";
export { useConvexUserId } from "./use-convex-user-id";
export { useContractEdit } from "./use-contract-edit";
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
