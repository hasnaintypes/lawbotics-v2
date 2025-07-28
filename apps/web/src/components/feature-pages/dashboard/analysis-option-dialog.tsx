"use client";

import {
  Check,
  FileText,
  Flag,
  Scale,
  Loader2,
  AlertTriangle,
  Eye,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAnalysis } from "@/hooks";
import { AnalysisLoadingDialog } from "./analysis-loading-dialog";
import { ANALYSIS_OPTIONS } from "../../../constants/analysis-errors";

/**
 * Props for the AnalysisOptionsDialog component
 */
interface AnalysisOptionsDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback function to close the dialog */
  onClose: () => void;
  /** The ID of the document to analyze */
  documentId: Id<"documents">;
}

/**
 * Analysis Options Dialog Component
 *
 * A comprehensive dialog for configuring document analysis parameters.
 * Allows users to select analysis perspective, depth, bias, and party information.
 * Integrates with the analysis workflow to initiate document processing.
 *
 * Features:
 * - Party selection from extracted parties or custom input
 * - Analysis depth configuration (summary vs full)
 * - Bias selection (neutral, favorable, risk-focused)
 * - Error handling with user-friendly messages
 * - Loading states with progress indication
 * - Form validation and state management
 *
 * @param props - The component props
 * @returns JSX element representing the analysis options dialog
 *
 * @example
 * ```tsx
 * <AnalysisOptionsDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   documentId={documentId}
 * />
 * ```
 */

export function AnalysisOptionsDialog({
  isOpen,
  onClose,
  documentId,
}: AnalysisOptionsDialogProps) {
  // Use the custom analysis hook for all state management and logic
  const {
    formState,
    isAnalyzing,
    error,
    loadingMessage,
    parties,
    handleSubmit,
    clearError,
    updateFormField,
  } = useAnalysis(documentId, onClose);

  /**
   * Validates the form before submission
   */
  const isFormValid = () => {
    // Party selection is required
    return formState.party === "other"
      ? formState.customParty.trim().length > 0
      : formState.party.length > 0;
  };

  return (
    <>
      {/* Main Configuration Dialog */}
      <Dialog open={isOpen && !isAnalyzing} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configure Analysis Options
            </DialogTitle>
            <DialogDescription>
              Customize how you want this document to be analyzed.
            </DialogDescription>
          </DialogHeader>

          {/* Error State */}
          {error && (
            <Alert
              className="mb-4"
              variant={
                error.includes("not a legal document")
                  ? "destructive"
                  : undefined
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error.includes("not a legal document") ? (
                  <span>
                    <strong>Not a Legal Document:</strong> <br />
                    {error}
                  </span>
                ) : (
                  error
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Form */}
          <div className="grid gap-4 py-2">
            {/* Party Selection */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="party">Analysis Perspective</Label>
              <Select
                value={formState.party}
                onValueChange={(value) => updateFormField("party", value)}
              >
                <SelectTrigger id="party">
                  <SelectValue placeholder="Select perspective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      value={ANALYSIS_OPTIONS.PERSPECTIVES.NEUTRAL.value}
                    >
                      {ANALYSIS_OPTIONS.PERSPECTIVES.NEUTRAL.label}
                    </SelectItem>
                    {parties.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value={ANALYSIS_OPTIONS.PERSPECTIVES.OTHER.value}
                    >
                      {ANALYSIS_OPTIONS.PERSPECTIVES.OTHER.label}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formState.party === "other" && (
                <Input
                  id="customParty"
                  placeholder="Enter perspective name"
                  value={formState.customParty}
                  onChange={(e) =>
                    updateFormField("customParty", e.target.value)
                  }
                />
              )}
            </div>

            {/* Analysis Bias */}
            <div className="grid gap-2">
              <Label>Analysis Bias</Label>
              <RadioGroup
                value={formState.bias}
                onValueChange={(value) =>
                  updateFormField("bias", value as typeof formState.bias)
                }
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem
                    value={ANALYSIS_OPTIONS.BIAS.NEUTRAL.value}
                    id="neutral-bias"
                  />
                  <Label
                    htmlFor="neutral-bias"
                    className="flex flex-1 items-center gap-2 font-normal"
                  >
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{ANALYSIS_OPTIONS.BIAS.NEUTRAL.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {ANALYSIS_OPTIONS.BIAS.NEUTRAL.description}
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem
                    value={ANALYSIS_OPTIONS.BIAS.FAVORABLE.value}
                    id="favorable-bias"
                  />
                  <Label
                    htmlFor="favorable-bias"
                    className="flex flex-1 items-center gap-2 font-normal"
                  >
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{ANALYSIS_OPTIONS.BIAS.FAVORABLE.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {ANALYSIS_OPTIONS.BIAS.FAVORABLE.description}
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              {error ? "Try Again" : "Start Analysis"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog */}
      <AnalysisLoadingDialog
        isOpen={isAnalyzing}
        loadingMessage={loadingMessage}
        title="Analyzing Document"
        description="This may take a few minutes. Please don't close this window."
      />
    </>
  );
}
