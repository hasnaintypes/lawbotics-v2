"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Calendar,
  User,
  AlertTriangle,
  Trash2,
  Eye,
  BarChart3,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { AnalysisOptionsDialog } from "./analysis-option-dialog";
import { useDocumentChat, useDocumentAnalysis } from "@/hooks";
import {
  getRiskBadgeVariant,
  getStatusBadgeVariant,
  formatRiskScore,
  navigateToDocument,
  navigateToAnalysis,
  useDocumentDeletion,
  getDocumentId,
  getActionLabels,
  getSmartActions,
  handleSmartNavigation,
  type DocumentEntry,
} from "@/lib";

/**
 * Props for the DocumentCard component
 */
interface DocumentCardProps extends Omit<DocumentEntry, "description"> {
  /** Optional description for the document */
  description?: string;
  /** Whether showing analyses or documents */
  showingAnalyses?: boolean;
}

/**
 * Document Card Component
 *
 * A comprehensive card component for displaying document or analysis information in a grid layout.
 * Provides interactive features including hover actions, status badges, risk indicators, and deletion functionality.
 * Uses centralized document utilities for consistent behavior across the application.
 *
 * ## Features
 * - **Smart Actions**: Context-aware primary and secondary actions based on document state
 * - **Status Badges**: Visual indicators for document and analysis status
 * - **Risk Assessment**: Color-coded risk score display with severity indicators
 * - **Interactive Menu**: Dropdown menu with document-specific actions
 * - **Responsive Design**: Optimized layout for different screen sizes
 * - **Loading States**: Visual feedback during operations
 * - **Accessibility**: Proper ARIA labels and keyboard navigation
 *
 * ## Smart Action Logic
 * - **Analyzed Documents**: Primary action = "View Analysis", Secondary = "Chat"
 * - **Processing Documents**: Primary action = "Processing..." (disabled), Secondary = "View Document"
 * - **Unanalyzed Documents**: Primary action = "Analyze Document", Secondary = "View Document"
 *
 * ## Dependencies
 * - `useDocumentAnalysis`: For starting analysis operations
 * - `useDocumentChat`: For initiating chat sessions
 * - `useDocumentDeletion`: For document removal operations
 * - Document utilities from `@/lib/documentUtils`
 *
 * @param props - Document card properties
 * @param props.id - Unique identifier (documentId or analysisId)
 * @param props.documentId - The actual document ID for API operations
 * @param props.title - Document title displayed in the card header
 * @param props.type - Document type (e.g., "Legal Contract", "PDF")
 * @param props.date - Creation or upload date in formatted string
 * @param props.status - Current status ("Uploaded", "Processing", "Completed", etc.)
 * @param props.risk_score - Risk assessment score or status string
 * @param props.last_modified - Last modification date in formatted string
 * @param props.author - Document author or uploader name
 * @param props.description - Optional document description
 * @param props.showingAnalyses - Whether displaying in analyses context vs documents
 * @param props.hasAnalysis - Whether document has associated analysis
 * @param props.analysisId - ID of associated analysis if exists
 * @param props.analysisStatus - Current analysis status if exists
 * @param props.isAnalyzed - Whether analysis is completed
 * @returns JSX element representing a document card
 *
 * @example
 * ```tsx
 * // Basic usage for unanalyzed document
 * <DocumentCard
 *   id="doc123"
 *   documentId="doc123"
 *   title="Employment Contract"
 *   type="Legal Contract"
 *   date="2024-01-15"
 *   status="Uploaded"
 *   risk_score="Not Analyzed"
 *   last_modified="2024-01-15"
 *   author="John Doe"
 *   hasAnalysis={false}
 *   isAnalyzed={false}
 * />
 *
 * // Usage for analyzed document
 * <DocumentCard
 *   id="analysis456"
 *   documentId="doc123"
 *   title="Employment Contract"
 *   type="Legal Contract"
 *   date="2024-01-15"
 *   status="Completed"
 *   risk_score="25"
 *   last_modified="2024-01-16"
 *   author="John Doe"
 *   hasAnalysis={true}
 *   analysisId="analysis456"
 *   analysisStatus="completed"
 *   isAnalyzed={true}
 *   showingAnalyses={true}
 * />
 * ```
 *
 * @see {@link useDocumentAnalysis} For analysis operations
 * @see {@link useDocumentChat} For chat functionality
 * @see {@link getSmartActions} For action logic
 * @see {@link DeleteConfirmationDialog} For deletion workflow
 */
export function DocumentCard({
  id,
  documentId,
  title,
  type,
  date,
  status,
  risk_score,
  last_modified,
  author,
  description,
  showingAnalyses = false,
  hasAnalysis,
  analysisId,
  analysisStatus,
  isAnalyzed,
  ...rest
}: DocumentCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteDocumentAndAnalyses } = useDocumentDeletion();

  // Use custom hooks for analysis and chat functionality
  const {
    startAnalysis,
    isExtractingParties,
    isAnalysisOptionsOpen,
    closeAnalysisOptions,
    currentDocumentId,
  } = useDocumentAnalysis();

  const { startChat } = useDocumentChat();

  // Create document entry for smart actions
  const documentEntry: DocumentEntry = {
    id,
    documentId,
    title,
    type,
    date,
    status,
    risk_score,
    last_modified,
    author,
    description: description || "",
    hasAnalysis: hasAnalysis || false,
    analysisId,
    analysisStatus,
    isAnalyzed: isAnalyzed || false,
  };

  // Get smart actions based on document status
  const smartActions = getSmartActions(documentEntry);

  /**
   * Handles smart primary action based on document state
   *
   * Determines the appropriate primary action (analyze, view analysis, etc.)
   * and executes it using the improved analysis workflow that prevents duplicates.
   *
   * @see {@link getSmartActions} For action determination logic
   */
  const handlePrimaryAction = () => {
    if (smartActions.primaryAction.action === "analyze") {
      // Start analysis workflow (will check for existing analysis)
      startAnalysis(documentEntry.documentId);
    } else if (smartActions.primaryAction.action === "view_analysis") {
      // Navigate to existing analysis using the analysis workflow
      if (documentEntry.analysisId) {
        startAnalysis(
          documentEntry.documentId,
          false,
          documentEntry.analysisId
        );
      }
    } else {
      handleSmartNavigation(
        router,
        documentEntry,
        smartActions.primaryAction.action
      );
    }
  };

  /**
   * Handles smart secondary action based on document state
   *
   * Executes the secondary action (chat, view document, etc.) using
   * the appropriate hook or navigation method.
   */
  const handleSecondaryAction = () => {
    if (smartActions.secondaryAction.action === "chat") {
      // Use the chat hook to start chat
      startChat(documentEntry.documentId);
    } else {
      handleSmartNavigation(
        router,
        documentEntry,
        smartActions.secondaryAction.action
      );
    }
  };

  /**
   * Handles document view navigation
   *
   * Navigates to the document view page using smart navigation utilities.
   */
  const handleViewDocument = () => {
    handleSmartNavigation(router, documentEntry, "view_document");
  };

  /**
   * Handles document deletion with confirmation and error handling
   *
   * Performs the actual deletion operation after user confirmation,
   * including both document and associated analyses cleanup.
   * Reloads the page after successful deletion.
   *
   * @throws {Error} When deletion operation fails
   */
  const handleDelete = async () => {
    const docId = documentEntry.documentId;
    if (!docId) return;

    setIsDeleting(true);
    try {
      await deleteDocumentAndAnalyses(docId, false);
      setShowDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // High risk determination for UI styling
  const isHighRisk = risk_score === "High" || Number.parseInt(risk_score) >= 75;

  return (
    <>
      <Card
        className="group h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
        onClick={handleViewDocument}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <span className="font-medium">{type}</span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {date}
                </span>
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrimaryAction();
                  }}
                  disabled={
                    smartActions.primaryAction.action === "process" ||
                    isExtractingParties
                  }
                >
                  {isExtractingParties ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : smartActions.primaryAction.icon === "Loader2" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : smartActions.primaryAction.icon === "FileSearch" ? (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  ) : (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  )}
                  {isExtractingParties
                    ? "Preparing Analysis..."
                    : smartActions.primaryAction.label}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSecondaryAction();
                  }}
                >
                  {smartActions.secondaryAction.icon === "MessageSquare" ? (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {smartActions.secondaryAction.label}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
              {status}
            </Badge>
            <Badge
              variant={getRiskBadgeVariant(risk_score)}
              className="text-xs flex items-center gap-1"
            >
              {isHighRisk && <AlertTriangle className="h-3 w-3" />}
              {formatRiskScore(risk_score)}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="pt-0 text-xs text-muted-foreground">
          <div className="flex w-full justify-between items-center">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {author}
            </span>
            <span>Modified {last_modified}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        document={showDeleteDialog ? documentEntry : null}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Analysis Options Dialog */}
      {currentDocumentId && (
        <AnalysisOptionsDialog
          isOpen={isAnalysisOptionsOpen}
          onClose={closeAnalysisOptions}
          documentId={currentDocumentId}
        />
      )}
    </>
  );
}
