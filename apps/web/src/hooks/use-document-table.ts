"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { DocumentEntry, SortDirection } from "@/lib";
import { useDocumentDeletion, handleSmartNavigation } from "@/lib";

/**
 * Configuration options for the document table hook
 */
interface UseDocumentTableOptions {
  /** Whether showing analyses or documents */
  showingAnalyses?: boolean;
}

/**
 * Custom hook for document table operations
 *
 * Provides comprehensive table functionality including sorting, filtering,
 * document actions, and deletion management. Centralizes table state and
 * operations for consistent behavior across table components.
 *
 * ## Features
 * - **Sorting**: Multi-column sorting with visual indicators
 * - **Document Actions**: View, analyze, delete operations
 * - **State Management**: Centralized table state and operations
 * - **Type Safety**: Full TypeScript support with proper typing
 *
 * @param documents - Array of document entries to manage
 * @param options - Configuration options for table behavior
 * @returns Table state and operations
 *
 * @example
 * ```typescript
 * const {
 *   sortedDocuments,
 *   sortField,
 *   sortDirection,
 *   handleSort,
 *   handleViewDocument,
 *   handleAnalyze,
 *   handleDeleteRequest,
 *   handleDeleteConfirm,
 *   handleDeleteCancel,
 *   deleteItem,
 *   isDeleting,
 * } = useDocumentTable(documents, { showingAnalyses: false });
 * ```
 */
export function useDocumentTable(
  documents: DocumentEntry[],
  options: UseDocumentTableOptions = {}
) {
  const router = useRouter();
  const { deleteDocumentAndAnalyses } = useDocumentDeletion();

  // Sorting state
  const [sortField, setSortField] = useState<keyof DocumentEntry | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Deletion state
  const [deleteItem, setDeleteItem] = useState<DocumentEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Sorted documents based on current sort configuration
   */
  const sortedDocuments = useMemo(() => {
    if (!sortField || !sortDirection) return documents;

    return [...documents].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? result : -result;
      }

      // Handle numeric comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        const result = aValue - bValue;
        return sortDirection === "asc" ? result : -result;
      }

      // Handle date comparison
      if (sortField === "date" || sortField === "last_modified") {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        const result = dateA - dateB;
        return sortDirection === "asc" ? result : -result;
      }

      // Handle risk score comparison
      if (sortField === "risk_score") {
        const scoreA =
          aValue === "Not Analyzed" || aValue === "Analyzing..."
            ? -1
            : Number.parseInt(aValue as string) || 0;
        const scoreB =
          bValue === "Not Analyzed" || bValue === "Analyzing..."
            ? -1
            : Number.parseInt(bValue as string) || 0;
        const result = scoreA - scoreB;
        return sortDirection === "asc" ? result : -result;
      }

      return 0;
    });
  }, [documents, sortField, sortDirection]);

  /**
   * Handle column sorting with toggle functionality
   *
   * @param field - The field to sort by
   */
  const handleSort = (field: keyof DocumentEntry) => {
    if (sortField === field) {
      // Toggle direction or reset to null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // Set new field and start with ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /**
   * Handle document view navigation
   *
   * @param doc - Document entry to view
   */
  const handleViewDocument = (doc: DocumentEntry) => {
    handleSmartNavigation(router, doc, "view_document");
  };

  /**
   * Handle document analysis initiation
   *
   * @param doc - Document entry to analyze
   */
  const handleAnalyze = (doc: DocumentEntry) => {
    // This will be handled by the component using the useDocumentAnalysis hook
    // We provide the interface here for consistency
    console.log("Analyze document:", doc.documentId);
  };

  /**
   * Handle deletion request - shows confirmation dialog
   *
   * @param doc - Document entry to delete
   */
  const handleDeleteRequest = (doc: DocumentEntry) => {
    setDeleteItem(doc);
  };

  /**
   * Handle deletion confirmation - performs actual deletion
   */
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);
    try {
      await deleteDocumentAndAnalyses(deleteItem.documentId, false);
      setDeleteItem(null);
      // Note: Page reload or state update should be handled by parent component
      window.location.reload();
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle deletion cancellation - closes confirmation dialog
   */
  const handleDeleteCancel = () => {
    setDeleteItem(null);
  };

  return {
    // Sorted data
    sortedDocuments,

    // Sort state
    sortField,
    sortDirection,

    // Sort actions
    handleSort,

    // Document actions
    handleViewDocument,
    handleAnalyze,

    // Deletion state and actions
    deleteItem,
    isDeleting,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
}
