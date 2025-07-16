"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Props for the AnalysisLoadingDialog component
 */
interface AnalysisLoadingDialogProps {
  /** Whether the loading dialog is open */
  isOpen: boolean;
  /** The current loading message to display */
  loadingMessage?: string;
  /** Optional title for the loading dialog */
  title?: string;
  /** Optional description for the loading dialog */
  description?: string;
}

/**
 * Analysis Loading Dialog Component
 *
 * A reusable loading dialog specifically designed for document analysis operations.
 * Displays a spinner, progress indicator, and dynamic loading messages to keep
 * users informed during the analysis process.
 *
 * @param props - The component props
 * @returns JSX element representing the loading dialog
 *
 * @example
 * ```tsx
 * <AnalysisLoadingDialog
 *   isOpen={isAnalyzing}
 *   loadingMessage="Connecting to AI analysis service..."
 *   title="Analyzing Document"
 *   description="Processing your request..."
 * />
 * ```
 */
export function AnalysisLoadingDialog({
  isOpen,
  loadingMessage = "Processing your request...",
  title = "Analyzing Document",
  description = "This may take a few minutes. Please don't close this window.",
}: AnalysisLoadingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg font-medium">Processing</span>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-6">
            {loadingMessage}
          </p>

          <div className="w-full max-w-xs">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-center">
            <p className="text-xs text-muted-foreground">
              Please wait while we process your analysis request
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
