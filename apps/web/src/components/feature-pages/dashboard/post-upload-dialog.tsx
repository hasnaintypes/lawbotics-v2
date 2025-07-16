"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, FileSearch, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnalysisOptionsDialog } from "./analysis-option-dialog";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useDocumentAnalysis } from "@/hooks";

/**
 * Props for the PostUploadDialog component
 */
interface PostUploadDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback function to control dialog open state */
  onOpenChange: (open: boolean) => void;
  /** The name of the uploaded file */
  fileName: string;
  /** The ID of the uploaded document */
  documentId: string;
}

/**
 * Post Upload Dialog Component
 *
 * A dialog that appears after successful document upload, offering users
 * options for what to do next with their uploaded document. Provides choices
 * between document analysis and chat functionality.
 *
 * Features:
 * - Document analysis with party extraction
 * - Chat with document functionality
 * - Loading states during processing
 * - Error handling with user feedback
 * - Smooth workflow transition to analysis options
 *
 * @param props - The component props
 * @returns JSX element representing the post-upload options dialog
 *
 * @example
 * ```tsx
 * <PostUploadDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   fileName="contract.pdf"
 *   documentId={documentId}
 * />
 * ```
 */
export function PostUploadDialog({
  open,
  onOpenChange,
  fileName,
  documentId,
}: PostUploadDialogProps) {
  const router = useRouter();

  // Use the improved document analysis hook
  const {
    startAnalysis,
    isProcessing,
    isExtractingParties,
    isAnalysisOptionsOpen,
    closeAnalysisOptions,
    currentDocumentId,
  } = useDocumentAnalysis();

  // Fetch document data to check processing status
  const getDocument = useQuery(api.documents.getDocument, {
    documentId: documentId as Id<"documents">,
  });

  /**
   * Handles the document analysis flow using the improved analysis workflow
   * Validates document readiness and starts the analysis process
   */
  const handleAnalyze = async () => {
    const documentData = getDocument;

    if (!documentData || !documentData.content) {
      console.warn(
        "Document content not yet available. Retrying or show user message."
      );
      toast.info("Document is still processing, please try again shortly.");
      return;
    }

    // Close the current dialog
    onOpenChange(false);

    // Start analysis using the improved hook
    await startAnalysis(documentId as Id<"documents">);
  };

  /**
   * Handles navigation to chat with document
   */
  const handleChat = () => {
    onOpenChange(false);
    router.push(`/chat/${documentId}`);
  };

  /**
   * Determines if the analyze button should be disabled
   */
  const isAnalyzeDisabled = () => {
    return (
      isProcessing ||
      !getDocument?.content ||
      getDocument?.status !== "completed"
    );
  };

  /**
   * Gets the appropriate analyze button content based on current state
   */
  const getAnalyzeButtonContent = () => {
    if (isExtractingParties) {
      return {
        icon: <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />,
        text: "Preparing Analysis...",
      };
    }

    if (getDocument?.status === "processing" && !getDocument?.content) {
      return {
        icon: <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />,
        text: "Processing Document...",
      };
    }

    return {
      icon: <FileSearch className="h-6 w-6 sm:h-8 sm:w-8" />,
      text: "Analyze Document",
    };
  };

  const analyzeButtonContent = getAnalyzeButtonContent();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Document Uploaded Successfully
            </DialogTitle>
            <DialogDescription>
              {fileName ? `"${fileName}"` : "Your document"} has been uploaded
              and processed. What would you like to do next?
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {/* Analyze Document Button */}
            <Button
              onClick={handleAnalyze}
              className="flex flex-col items-center justify-center h-20 sm:h-24 gap-2 w-full transition-all hover:scale-105"
              variant="outline"
              disabled={isAnalyzeDisabled()}
            >
              {analyzeButtonContent.icon}
              <span className="text-center text-sm font-medium">
                {analyzeButtonContent.text}
              </span>
            </Button>

            {/* Chat with Document Button */}
            <Button
              onClick={handleChat}
              className="flex flex-col items-center justify-center h-20 sm:h-24 gap-2 w-full transition-all hover:scale-105"
              variant="outline"
              disabled={!getDocument?.content}
            >
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-center text-sm font-medium">
                Chat with Document
              </span>
            </Button>
          </div>

          {/* Document Status Info */}
          {getDocument && (
            <div className="text-xs text-muted-foreground text-center py-2">
              Status:{" "}
              {getDocument.status === "completed" ? "Ready" : "Processing"}
              {getDocument.content && (
                <span>
                  {" "}
                  • {Math.round(getDocument.content.length / 1000)}k characters
                </span>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
