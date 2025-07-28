"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  categorizeAnalysisError,
  ANALYSIS_LOADING_MESSAGES,
  type AnalysisBias,
} from "../constants/analysis-errors";

/**
 * Analysis form state interface
 */
export interface AnalysisFormState {
  party: string;
  customParty: string;
  bias: AnalysisBias;
}

/**
 * Analysis hook return type
 */
interface UseAnalysisReturn {
  // Form state
  formState: AnalysisFormState;
  setFormState: (updates: Partial<AnalysisFormState>) => void;

  // Loading and error states
  isAnalyzing: boolean;
  error: string | null;
  loadingMessage: string;

  // Data
  parties: string[];

  // Actions
  handleSubmit: () => Promise<void>;
  clearError: () => void;
  updateFormField: <K extends keyof AnalysisFormState>(
    field: K,
    value: AnalysisFormState[K]
  ) => void;
}

/**
 * Custom hook for managing document analysis workflow
 *
 * Encapsulates all logic related to document analysis including form state management,
 * API calls, error handling, and loading states. Provides a clean interface for
 * components to interact with the analysis functionality.
 *
 * @param documentId - The ID of the document to analyze
 * @param onSuccess - Callback function called when analysis starts successfully
 * @returns Object containing form state, loading states, and action handlers
 *
 * @example
 * ```tsx
 * const {
 *   formState,
 *   isAnalyzing,
 *   error,
 *   loadingMessage,
 *   parties,
 *   handleSubmit,
 *   clearError,
 *   updateFormField
 * } = useAnalysis(documentId, () => onClose());
 * ```
 */
export function useAnalysis(
  documentId: Id<"documents">,
  onSuccess?: () => void
): UseAnalysisReturn {
  const router = useRouter();

  // Form state
  const [formState, setFormStateInternal] = useState<AnalysisFormState>({
    party: "neutral",
    customParty: "",
    bias: "neutral",
  });

  // Loading and error states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // API hooks
  const parties =
    useQuery(api.extractedParties.getExtractedParties, { documentId }) || [];
  const analyzeDocument = useAction(
    api.actions.analyzeDocument.analyzeDocument
  );

  /**
   * Updates form state with partial updates
   */
  const setFormState = (updates: Partial<AnalysisFormState>) => {
    setFormStateInternal((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Updates a specific form field and clears any existing errors
   */
  const updateFormField = <K extends keyof AnalysisFormState>(
    field: K,
    value: AnalysisFormState[K]
  ) => {
    setFormState({ [field]: value });
    clearError();
  };

  /**
   * Clears the current error state
   */
  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  /**
   * Handles the analysis submission process
   */
  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setError(null);
    setLoadingMessage(ANALYSIS_LOADING_MESSAGES.INITIALIZING);

    try {
      // Determine the selected party
      const selectedParty =
        formState.party === "other" ? formState.customParty : formState.party;

      if (!selectedParty.trim()) {
        throw new Error("Please select or specify a party perspective");
      }

      setLoadingMessage(ANALYSIS_LOADING_MESSAGES.CONNECTING);

      // Call the analyze document action
      const result = await analyzeDocument({
        documentId,
        partyPerspective: selectedParty,
        analysisBias: formState.bias,
      });

      console.log("Analysis initiated:", result);

      // If the error code is NOT_LEGAL_DOCUMENT, show a specific error and do not navigate
      if (result.code === "NOT_LEGAL_DOCUMENT") {
        setError(
          result.error ||
            "This PDF is not a legal document, contract, policy, or agreement."
        );
        return;
      }

      if (result.success && result.analysisId) {
        setLoadingMessage(ANALYSIS_LOADING_MESSAGES.SUCCESS);

        // Small delay to show success message
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Navigate to the analysis page
        router.push(`/analysis/${documentId}`);

        // Call success callback if provided
        onSuccess?.();
      } else {
        const errorMessage = result.error || "Unknown error occurred";
        setError(categorizeAnalysisError(errorMessage));
      }
    } catch (error: any) {
      console.error("Error analyzing document:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      setError(categorizeAnalysisError(errorMessage));
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage("");
    }
  };

  /**
   * Set default party if none is selected
   */
  useEffect(() => {
    if (!formState.party) {
      setFormState({ party: "neutral" });
    }
  }, [formState.party]);

  return {
    formState,
    setFormState,
    isAnalyzing,
    error,
    loadingMessage,
    parties,
    handleSubmit,
    clearError,
    updateFormField,
  };
}
