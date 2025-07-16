"use client";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DocumentEntry } from "@/lib";

/**
 * Props for the DeleteConfirmationDialog component
 */
interface DeleteConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Document to delete (null when closed) */
  document: DocumentEntry | null;
  /** Whether deletion is in progress */
  isDeleting: boolean;
  /** Callback when deletion is confirmed */
  onConfirm: () => void;
  /** Callback when deletion is cancelled */
  onCancel: () => void;
}

/**
 * Delete Confirmation Dialog Component
 *
 * A confirmation dialog for deleting documents or analyses. Provides
 * clear information about what will be deleted and handles the confirmation
 * flow with loading states.
 *
 * Features:
 * - Clear warning about deletion consequences
 * - Loading state during deletion
 * - Accessible keyboard navigation
 * - Descriptive action buttons
 *
 * @param props - Component properties
 * @returns JSX element representing the delete confirmation dialog
 *
 * @example
 * ```tsx
 * <DeleteConfirmationDialog
 *   open={showDeleteDialog}
 *   onOpenChange={setShowDeleteDialog}
 *   document={documentToDelete}
 *   isDeleting={isDeleting}
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  document,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  if (!document) return null;

  const itemType =
    document.hasAnalysis && document.isAnalyzed ? "analysis" : "document";
  const itemTitle = document.title || "Untitled Document";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {itemType === "analysis" ? "Analysis" : "Document"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{itemTitle}"</span>?
            </p>
            {itemType === "document" && (
              <p className="text-sm text-muted-foreground">
                This will permanently delete the document and all associated
                analyses. This action cannot be undone.
              </p>
            )}
            {itemType === "analysis" && (
              <p className="text-sm text-muted-foreground">
                This will permanently delete the analysis results. The original
                document will remain intact. This action cannot be undone.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {itemType === "analysis" ? "Analysis" : "Document"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
