"use client";

import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  BarChart3,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { AnalysisOptionsDialog } from "./analysis-option-dialog";
import {
  useDocumentChat,
  useDocumentAnalysis,
  useDocumentTable,
} from "@/hooks";
import {
  getRiskBadgeVariant,
  getStatusBadgeVariant,
  formatRiskScore,
  getActionLabels,
  type DocumentEntry,
} from "@/lib";

/**
 * Props for the DocumentTable component
 */
interface DocumentTableProps {
  /** Array of documents to display in the table */
  documents: DocumentEntry[];
  /** Whether showing analyses or documents context */
  showingAnalyses?: boolean;
}

/**
 * Document Table Component
 *
 * A comprehensive table component for displaying documents or analyses with advanced
 * functionality including sorting, filtering, and action capabilities. Uses the useDocumentTable
 * hook for centralized table operations and document utilities for consistent behavior.
 *
 * ## Features
 * - **Sortable Columns**: Click column headers to sort by any field with visual indicators
 * - **Row Actions**: Context menu with view, analyze, chat, and delete operations
 * - **Responsive Design**: Mobile-optimized layout with collapsible columns
 * - **Confirmation Dialogs**: Safe deletion workflow with user confirmation
 * - **Consistent Styling**: Badge variants for status and risk score indicators
 * - **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
 * - **Loading States**: Visual feedback during operations
 * - **Smart Analysis**: Prevents duplicate analyses and navigates to existing ones
 *
 * ## Column Structure
 * - **Document/Analysis**: Title with responsive metadata on mobile
 * - **Type**: Document type with outline badge styling
 * - **Date**: Creation/upload date (hidden on mobile)
 * - **Status**: Current status with color-coded badges
 * - **Risk Score**: Risk assessment with severity indicators
 * - **Author**: Document author (hidden on mobile)
 * - **Actions**: Dropdown menu with contextual operations
 *
 * ## Sorting Behavior
 * - **Text Fields**: Alphabetical sorting with locale-aware comparison
 * - **Dates**: Chronological sorting with proper date parsing
 * - **Risk Scores**: Numeric sorting with special handling for "Not Analyzed" states
 * - **Triple-State**: asc → desc → none → asc (allows clearing sort)
 *
 * ## Action Menu
 * - **View Document**: Navigate to document viewer
 * - **Analyze Document**: Start new analysis or navigate to existing
 * - **Chat with PDF**: Open AI chat interface
 * - **Delete**: Remove document with confirmation dialog
 *
 * @param props - Component props
 * @returns JSX element representing the document table
 *
 * @see {@link useDocumentTable} For table operations and state management
 * @see {@link useDocumentAnalysis} For analysis workflow
 * @see {@link useDocumentChat} For chat functionality
 * @see {@link DeleteConfirmationDialog} For deletion workflow
 * @see {@link AnalysisOptionsDialog} For analysis configuration
 */
export function DocumentTable({
  documents,
  showingAnalyses = false,
}: DocumentTableProps) {
  const router = useRouter();

  // Use custom hooks for analysis and chat functionality
  const {
    startAnalysis,
    isProcessing,
    isAnalysisOptionsOpen,
    closeAnalysisOptions,
    currentDocumentId,
  } = useDocumentAnalysis();

  const { startChat } = useDocumentChat();

  const {
    sortedDocuments,
    sortField,
    sortDirection,
    handleSort,
    handleViewDocument,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
    deleteItem,
    isDeleting,
  } = useDocumentTable(documents, { showingAnalyses });

  const labels = getActionLabels(showingAnalyses);

  /**
   * Handles document analysis using the document analysis hook
   *
   * Intelligently determines whether to start new analysis or navigate to existing one.
   * Uses the improved analysis workflow to prevent duplicate analyses and provide
   * better user experience.
   *
   * @param doc - Document entry to analyze
   */
  const handleAnalyze = (doc: DocumentEntry) => {
    if (doc.isAnalyzed && doc.analysisId) {
      // Navigate to existing analysis
      startAnalysis(doc.documentId, false, doc.analysisId);
    } else {
      // Start new analysis
      startAnalysis(doc.documentId);
    }
  };

  /**
   * Handles chat initiation with a document using the chat hook
   *
   * Opens the chat interface for the specified document, allowing
   * users to interact with the document content through AI chat.
   *
   * @param doc - Document entry to chat with
   */
  const handleChatWithDocument = (doc: DocumentEntry) => {
    startChat(doc.documentId);
  };

  /**
   * Gets the appropriate sort icon based on current field and direction
   *
   * Returns visual indicators for column sorting state:
   * - Neutral icon when column is not sorted
   * - Up arrow for ascending sort
   * - Down arrow for descending sort
   *
   * @param field - The field to get sort icon for
   * @returns JSX element representing the sort state
   */
  const getSortIcon = (field: keyof DocumentEntry) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                {labels.itemType}
                {getSortIcon("title")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("type")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Type
                {getSortIcon("type")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Date
                {getSortIcon("date")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("risk_score")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Risk Score
                {getSortIcon("risk_score")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("author")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Author
                {getSortIcon("author")}
              </Button>
            </TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDocuments.map((doc: DocumentEntry) => (
            <TableRow key={doc.id} className="group">
              <TableCell className="font-medium">
                <div className="max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">
                  <div className="font-semibold truncate">{doc.title}</div>
                  <div className="md:hidden text-xs text-muted-foreground mt-1">
                    {doc.type} • {doc.date}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className="text-xs">
                  {doc.type}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {doc.date}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(doc.status)}
                  className="text-xs"
                >
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getRiskBadgeVariant(doc.risk_score)}
                  className="text-xs"
                >
                  {formatRiskScore(doc.risk_score)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {doc.author}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Document
                    </DropdownMenuItem>
                    {doc.isAnalyzed && doc.analysisId ? (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/analysis/${doc.analysisId}`)
                        }
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analysis
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleAnalyze(doc)}
                        disabled={isProcessing}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : doc.hasAnalysis &&
                          doc.analysisStatus === "processing" ? (
                          "Re-analyze"
                        ) : (
                          "Analyze Document"
                        )}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleChatWithDocument(doc)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteRequest(doc)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {labels.deleteAction}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && handleDeleteCancel()}
        document={deleteItem}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Analysis Options Dialog */}
      {currentDocumentId && (
        <AnalysisOptionsDialog
          isOpen={isAnalysisOptionsOpen}
          onClose={closeAnalysisOptions}
          documentId={currentDocumentId}
        />
      )}
    </div>
  );
}
