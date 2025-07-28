"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAnalysisStore } from "@/store/analysis.store";

/**
 * Analysis fetch result interface
 */
interface AnalysisFetchResult {
  /** The fetched analysis data */
  analysis: any;
  /** The associated document data */
  document: any;
  /** Current parameter value from URL */
  paramValue: string;
  /** Loading state for analysis */
  isAnalysisLoading: boolean;
  /** Loading state for document */
  isDocumentLoading: boolean;
  /** Overall loading state */
  isLoading: boolean;
  /** Error state for analysis not found */
  isAnalysisNotFound: boolean;
  /** Error state for document not found */
  isDocumentNotFound: boolean;
  /** Whether analysis failed */
  isAnalysisFailed: boolean;
  /** Whether analysis is still processing */
  isAnalysisProcessing: boolean;
}

/**
 * Custom hook for fetching document analysis data
 *
 * This hook manages the complex logic of fetching analysis data from multiple sources:
 * - First checks the analysis store for cached data
 * - Falls back to Convex queries for analysis by ID
 * - Falls back to fetching latest analysis for a document ID
 * - Fetches associated document data
 * - Provides comprehensive loading and error states
 *
 * The hook intelligently determines whether the URL parameter is an analysis ID
 * or a document ID and fetches accordingly, providing a unified interface for
 * the analysis page component.
 *
 * @returns Object containing analysis data, document data, and various state flags
 *
 * @example
 * ```typescript
 * function AnalysisPage() {
 *   const {
 *     analysis,
 *     document,
 *     paramValue,
 *     isLoading,
 *     isAnalysisNotFound,
 *     isDocumentNotFound,
 *     isAnalysisFailed,
 *     isAnalysisProcessing
 *   } = useAnalysisFetch();
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (isDocumentNotFound) {
 *     return <DocumentNotFound />;
 *   }
 *
 *   // Render analysis content
 *   return <AnalysisContent analysis={analysis} document={document} />;
 * }
 * ```
 */
export function useAnalysisFetch(): AnalysisFetchResult {
  const params = useParams();
  const paramValue = params.documentId as string;

  // Use the analysis store
  const { analyses } = useAnalysisStore();

  // Try to get analysis from the store first
  const storeAnalysis = analyses.find(
    (a) => a._id === paramValue || a.documentId === paramValue
  );

  // Then try Convex queries as fallback
  const analysisByIdQuery = useQuery(
    api.analyses.getAnalysis,
    !storeAnalysis ? { analysisId: paramValue as Id<"analyses"> } : "skip"
  );

  const analysisByDocQuery = useQuery(
    api.analyses.getLatestAnalysisForDocument,
    !storeAnalysis && !analysisByIdQuery
      ? { documentId: paramValue as Id<"documents"> }
      : "skip"
  );

  // Use store first, then API queries
  const analysis = storeAnalysis || analysisByIdQuery || analysisByDocQuery;

  // Get the document details
  const document = useQuery(api.documents.getDocument, {
    documentId: (analysis?.documentId || paramValue) as Id<"documents">,
  });

  // Calculate loading states
  const isAnalysisLoading = analysis === undefined;
  const isDocumentLoading = document === undefined;
  const isLoading = isAnalysisLoading || isDocumentLoading;

  // Calculate error states
  const isDocumentNotFound = document === null;
  const isAnalysisNotFound = analysis === null;
  const isAnalysisFailed = !!(analysis && analysis.status === "failed");
  const isAnalysisProcessing =
    analysis === null ||
    !analysis ||
    analysis.status === "pending" ||
    analysis.status === "processing";

  return {
    analysis,
    document,
    paramValue,
    isAnalysisLoading,
    isDocumentLoading,
    isLoading,
    isAnalysisNotFound,
    isDocumentNotFound,
    isAnalysisFailed,
    isAnalysisProcessing,
  };
}
