"use client";
import { useState, useCallback, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

/**
 * Analysis workflow state
 */
type AnalysisWorkflowState =
  | "idle"
  | "checking"
  | "extracting"
  | "ready_for_options"
  | "navigating";

/**
 * Custom hook for document analysis operations
 *
 * Provides comprehensive functionality for document analysis workflow including:
 * - Checking for existing analyses to prevent duplicates
 * - Fetching document content when needed
 * - Managing party extraction and analysis options
 * - Navigation to existing or new analyses
 * - Centralized error handling and loading states
 * - Callback mechanism for UI refresh after analysis completes
 *
 * ## Features
 * - **Smart Analysis Detection**: Prevents duplicate analyses by checking existing data
 * - **Content Validation**: Ensures document content is available before processing
 * - **Reusable Interface**: Can be used across table, card, and dialog components
 * - **Error Handling**: Comprehensive error states with user-friendly messages
 * - **Loading States**: Granular loading indicators for different workflow steps
 * - **UI Refresh**: Triggers UI updates when analysis workflow completes
 *
 * @param onAnalysisComplete - Optional callback when analysis workflow completes successfully
 * @returns Analysis state and operations
 *
 * @example
 * ```typescript
 * const {
 *   startAnalysis,
 *   isProcessing,
 *   isAnalysisOptionsOpen,
 *   closeAnalysisOptions,
 *   currentDocumentId,
 *   workflowState,
 * } = useDocumentAnalysis(() => {
 *   // Refresh the document list or trigger re-fetch
 *   window.location.reload();
 * });
 *
 * // Start analysis workflow for a document
 * await startAnalysis(documentId);
 * ```
 */
export function useDocumentAnalysis(onAnalysisComplete?: () => void) {
  const router = useRouter();

  // State management
  const [workflowState, setWorkflowState] =
    useState<AnalysisWorkflowState>("idle");
  const [isAnalysisOptionsOpen, setIsAnalysisOptionsOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] =
    useState<Id<"documents"> | null>(null);

  // Convex hooks
  const extractPartiesAction = useAction(
    api.actions.extractParties.extractParties
  );

  // Derived state
  const isProcessing = workflowState !== "idle";
  const isExtractingParties = workflowState === "extracting";
  const isCheckingAnalysis = workflowState === "checking";

  /**
   * Start analysis workflow for a document
   *
   * Intelligently handles the analysis process by:
   * 1. Checking for existing analysis first
   * 2. Validating document content availability
   * 3. Extracting parties if needed
   * 4. Opening analysis options or navigating to existing analysis
   *
   * @param documentId - The ID of the document to analyze
   * @param forceNewAnalysis - Whether to force a new analysis even if one exists
   * @param existingAnalysisId - Optional existing analysis ID to check
   */
  const startAnalysis = async (
    documentId: Id<"documents">,
    forceNewAnalysis: boolean = false,
    existingAnalysisId?: Id<"analyses">
  ) => {
    try {
      setWorkflowState("checking");
      setCurrentDocumentId(documentId);

      // If document already has a completed analysis, navigate to it instead
      if (existingAnalysisId && !forceNewAnalysis) {
        setWorkflowState("navigating");
        toast.success("Opening existing analysis...");
        router.push(`/analysis/${existingAnalysisId}`);
        setWorkflowState("idle");
        return;
      }

      // Start party extraction for new analysis
      setWorkflowState("extracting");

      const result = await extractPartiesAction({
        documentId,
        // Document content will be fetched internally by the action
      });

      if (result.success) {
        // Open analysis options dialog
        setWorkflowState("ready_for_options");
        setIsAnalysisOptionsOpen(true);
      } else {
        console.log(result.error)
        toast.error(result.error || "Failed to prepare document for analysis");
        setWorkflowState("idle");
      }
    } catch (error) {
      console.error("Error in analysis workflow:", error);
      toast.error("Failed to start analysis. Please try again.");
      setWorkflowState("idle");
    }
  };

  /**
   * Close the analysis options dialog and reset state
   */
  const closeAnalysisOptions = useCallback(() => {
    setIsAnalysisOptionsOpen(false);
    setCurrentDocumentId(null);
    setWorkflowState("idle");

    // Trigger refresh callback if provided
    if (onAnalysisComplete) {
      onAnalysisComplete();
    }
  }, [onAnalysisComplete]);

  /**
   * Reset all analysis state to initial values
   */
  const resetAnalysisState = () => {
    setWorkflowState("idle");
    setIsAnalysisOptionsOpen(false);
    setCurrentDocumentId(null);
  };

  /**
   * Start new analysis even if one exists (for re-analysis)
   *
   * @param documentId - Document ID to re-analyze
   */
  const startNewAnalysis = async (documentId: Id<"documents">) => {
    await startAnalysis(documentId, true);
  };

  // Effect for triggering UI refresh callback
  useEffect(() => {
    if (workflowState === "idle" && onAnalysisComplete) {
      onAnalysisComplete();
    }
  }, [workflowState, onAnalysisComplete]);

  return {
    // State
    workflowState,
    isProcessing,
    isExtractingParties,
    isCheckingAnalysis,
    isAnalysisOptionsOpen,
    currentDocumentId,

    // Actions
    startAnalysis,
    startNewAnalysis,
    closeAnalysisOptions,
    resetAnalysisState,
  };
}
