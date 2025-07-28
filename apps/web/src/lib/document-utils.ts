// Gemini legal document check is now handled in the backend (Convex action).
import type { Id } from "../../convex/_generated/dataModel";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

/**
 * Unified document entry that combines document and analysis data
 * Used to display both analyzed and unanalyzed documents in a consistent format
 */
export interface DocumentEntry {
  id: string; // Either documentId or analysisId
  documentId: Id<"documents">; // Always the actual document ID
  title: string;
  type: string;
  date: string; // Formatted date string
  status: string; // "Uploaded", "Processing", "completed", "failed", etc.
  risk_score: string; // Score as string or "Not Analyzed" / "Analyzing..."
  last_modified: string; // Formatted date string
  author: string;
  description: string;
  hasAnalysis: boolean; // Whether this document has an analysis
  analysisId?: Id<"analyses">; // The analysis ID if it exists
  analysisStatus?: string; // The analysis status
  isAnalyzed: boolean; // Whether the analysis is completed
}

/**
 * Sort direction for table columns
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Available actions for documents
 */
export type DocumentAction =
  | "view_document"
  | "view_analysis"
  | "analyze"
  | "chat"
  | "process";

/**
 * Smart action configuration
 */
export interface SmartAction {
  action: DocumentAction;
  label: string;
  icon: string;
  disabled?: boolean;
}

/**
 * Smart actions for document operations
 */
export interface SmartActions {
  primaryAction: SmartAction;
  secondaryAction: SmartAction;
}

/**
 * Get the appropriate badge variant for risk scores
 * @param riskScore - The risk score as a string
 * @returns Badge variant
 */
export function getRiskBadgeVariant(
  riskScore: string
): "default" | "secondary" | "destructive" | "outline" {
  if (riskScore === "Not Analyzed" || riskScore === "Analyzing...") {
    return "outline";
  }

  const score = Number.parseInt(riskScore);
  if (isNaN(score)) return "outline";

  if (score >= 75) return "destructive";
  if (score >= 40) return "secondary";
  return "default";
}

/**
 * Get the appropriate badge variant for status
 * @param status - The document status
 * @returns Badge variant
 */
export function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "default";
    case "processing":
    case "analyzing":
      return "secondary";
    case "failed":
    case "error":
      return "destructive";
    case "uploaded":
    case "pending":
    default:
      return "outline";
  }
}

/**
 * Format risk score for display
 * @param riskScore - The risk score as a string
 * @returns Formatted risk score
 */
export function formatRiskScore(riskScore: string): string {
  if (riskScore === "Not Analyzed" || riskScore === "Analyzing...") {
    return riskScore;
  }

  const score = Number.parseInt(riskScore);
  if (isNaN(score)) return riskScore;

  if (score >= 75) return `${score}% High`;
  if (score >= 40) return `${score}% Medium`;
  return `${score}% Low`;
}

/**
 * Navigate to document view
 * @param router - Next.js router instance
 * @param documentEntry - Document entry
 */
export function navigateToDocument(
  router: AppRouterInstance,
  documentEntry: DocumentEntry
): void {
  router.push(`/documents/${documentEntry.documentId}`);
}

/**
 * Navigate to analysis view
 * @param router - Next.js router instance
 * @param documentEntry - Document entry
 */
export function navigateToAnalysis(
  router: AppRouterInstance,
  documentEntry: DocumentEntry
): void {
  if (documentEntry.analysisId) {
    router.push(`/analysis/${documentEntry.analysisId}`);
  }
}

/**
 * Get document ID from document entry
 * @param documentEntry - Document entry
 * @returns Document ID
 */
export function getDocumentId(documentEntry: DocumentEntry): Id<"documents"> {
  return documentEntry.documentId;
}

/**
 * Get action labels based on context
 * @param showingAnalyses - Whether showing analyses or documents
 * @returns Action labels
 */
export function getActionLabels(showingAnalyses: boolean) {
  return {
    itemType: showingAnalyses ? "Analysis" : "Document",
    analyzeAction: showingAnalyses ? "Re-analyze" : "Analyze Document",
    deleteAction: showingAnalyses ? "Delete Analysis" : "Delete Document",
  };
}

/**
 * Get smart actions for a document entry
 * @param documentEntry - Document entry
 * @returns Smart actions configuration
 */
export function getSmartActions(documentEntry: DocumentEntry): SmartActions {
  // If document has completed analysis, primary action is view analysis
  if (documentEntry.isAnalyzed && documentEntry.analysisId) {
    return {
      primaryAction: {
        action: "view_analysis",
        label: "View Analysis",
        icon: "FileSearch",
      },
      secondaryAction: {
        action: "chat",
        label: "Chat with PDF",
        icon: "MessageSquare",
      },
    };
  }

  // If document is being analyzed, show processing state
  if (
    documentEntry.hasAnalysis &&
    documentEntry.analysisStatus === "processing"
  ) {
    return {
      primaryAction: {
        action: "process",
        label: "Processing...",
        icon: "Loader2",
        disabled: true,
      },
      secondaryAction: {
        action: "chat",
        label: "Chat with PDF",
        icon: "MessageSquare",
      },
    };
  }

  // Default: unanalyzed document
  return {
    primaryAction: {
      action: "analyze",
      label: "Analyze Document",
      icon: "FileSearch",
    },
    secondaryAction: {
      action: "chat",
      label: "Chat with PDF",
      icon: "MessageSquare",
    },
  };
}

/**
 * Handle smart navigation based on action
 * @param router - Next.js router instance
 * @param documentEntry - Document entry
 * @param action - Action to perform
 */
export function handleSmartNavigation(
  router: AppRouterInstance,
  documentEntry: DocumentEntry,
  action: DocumentAction
): void {
  switch (action) {
    case "view_document":
      router.push(`/documents/${documentEntry.documentId}`);
      break;
    case "view_analysis":
      if (documentEntry.analysisId) {
        router.push(`/analysis/${documentEntry.analysisId}`);
      }
      break;
    case "chat":
      router.push(`/chat-with-pdf/${documentEntry.documentId}`);
      break;
    default:
      // Handle other actions (analyze, process) in component-specific handlers
      break;
  }
}

/**
 * Hook for document deletion functionality
 * @returns Document deletion utilities
 */
export function useDocumentDeletion() {
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const deleteAnalyses = useMutation(api.analyses.deleteAllAnalysesForDocument);

  const deleteDocumentAndAnalyses = async (
    documentId: Id<"documents">,
    deleteAnalysesOnly: boolean = false
  ) => {
    try {
      // Always delete analyses first
      await deleteAnalyses({ documentId });

      // Delete document if not analysis-only deletion
      if (!deleteAnalysesOnly) {
        await deleteDocument({ documentId });
      }
    } catch (error) {
      console.error("Error deleting document and analyses:", error);
      throw error;
    }
  };

  return {
    deleteDocumentAndAnalyses,
  };
}

/**
 * Utility functions for document operations
 */
export const documentUtils = {
  /**
   * Check if a document entry represents an analyzed document
   */
  isAnalyzed: (entry: DocumentEntry): boolean => entry.isAnalyzed,

  /**
   * Check if a document entry is currently being analyzed
   */
  isProcessing: (entry: DocumentEntry): boolean =>
    entry.hasAnalysis && entry.analysisStatus === "processing",

  /**
   * Get the display status for a document entry
   */
  getDisplayStatus: (entry: DocumentEntry): string => entry.status,

  /**
   * Get the appropriate risk score display
   */
  getRiskScoreDisplay: (entry: DocumentEntry): string => entry.risk_score,
};

/**
 * Uploads a document file to the server with complete processing pipeline
 * Creates document record, uploads file to storage, and triggers background processing
 *
 * @param convex - The Convex client instance for database operations
 * @param file - The file object to upload
 * @param userId - The Clerk user ID of the document owner
 * @return Promise resolving to upload result with document ID and success status
 */
export async function uploadDocument(
  convex: any,
  file: File,
  userId: string
): Promise<{ documentId: Id<"documents">; success: boolean; error?: string }> {
  try {
    const documentId = await convex.mutation(api.documents.createDocument, {
      title: file.name,
      userId: userId,
      fileType: file.type,
      fileSize: file.size,
    });

    const { uploadUrl } = await convex.mutation(
      api.documents.generateUploadUrl,
      {
        documentId,
      }
    );

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.statusText}`);
    }

    const { storageId } = await result.json();

    await convex.mutation(api.documents.updateDocumentWithFileUrl, {
      documentId,
      storageId,
    });

    return { documentId, success: true };
  } catch (error) {
    console.error("Error uploading document:", error);
    return {
      documentId: "" as Id<"documents">,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * React hook to fetch all documents owned by a specific user
 *
 * @param userId - The Clerk user ID to fetch documents for
 * @return Query result containing array of user's documents
 */
export function useDocuments(userId: string) {
  return useQuery(api.documents.getDocuments, { userId });
}

/**
 * React hook to fetch a single document by its ID
 *
 * @param documentId - The ID of the document to retrieve
 * @return Query result containing the document data
 */
export function useDocument(documentId: Id<"documents">) {
  return useQuery(api.documents.getDocument, { documentId });
}

/**
 * React hook to get a mutation function for deleting documents
 *
 * @return Mutation function that accepts a document ID and deletes the document
 */
export function useDeleteDocument() {
  return useMutation(api.documents.deleteDocument);
}
