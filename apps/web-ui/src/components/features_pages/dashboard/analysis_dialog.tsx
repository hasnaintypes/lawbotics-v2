"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, FileSearch, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AnalysisOptionsDialog } from "./analysis_option_dialog"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface AnalysisDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  documentId: string
}

export function AnalysisDialog({ open, onOpenChange, fileName, documentId }: AnalysisDialogProps) {
  const router = useRouter()
  const [isAnalysisOptionsOpen, setIsAnalysisOptionsOpen] = useState(false)
  const [isExtractingParties, setIsExtractingParties] = useState(false)
  const getDocument = useQuery(api.documents.getDocument, { documentId: documentId as Id<"documents"> });
  const extractParties = useAction(api.actions.extractParties.extractParties)

  const handleAnalyze = async () => {
    const documentData = getDocument;

    if (!documentData || !documentData.content) {
      console.warn("Document content not yet available. Retrying or show user message.");
      // Optionally, show a toast message to the user
      // toast.info("Document is still processing, please try again shortly.");
      return; // Exit if content is not ready
    }

    // Close the current dialog
    onOpenChange(false)

    // Start extracting parties
    setIsExtractingParties(true)

    try {
      console.log("Starting document analysis...");
      console.log("Document content length:", documentData.content.length);

      await extractParties({
        documentId: documentId as Id<"documents">,
        documentContent: documentData.content, // Pass the actual content
      })

      console.log("Document analysis completed.");
      // Open the analysis options dialog
      setIsAnalysisOptionsOpen(true)
    } catch (error) {
      console.error("Error extracting parties:", error)
      // You might want to show an error toast here, e.g., using the 'sonner' library if available
      // toast.error("Failed to analyze document. Please try again.");
    } finally {
      setIsExtractingParties(false)
    }
  }

  const handleChat = () => {
    // Handle chat with document
    onOpenChange(false)
    // Navigate to chat page
    router.push(`/chat-with-pdf/${documentId}`)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Uploaded Successfully</DialogTitle>
            <DialogDescription>
              Your document "{fileName}" has been uploaded. What would you like to do next?
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <Button
              onClick={handleAnalyze}
              className="flex flex-col items-center justify-center h-20 sm:h-24 gap-2 w-full"
              variant="outline"
              disabled={isExtractingParties || !getDocument?.content || getDocument?.status !== 'completed'}
            >
              {isExtractingParties || (getDocument?.status === 'processing' && !getDocument?.content) ? (
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
              ) : isExtractingParties ? (
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
              ) : (
                <FileSearch className="h-6 w-6 sm:h-8 sm:w-8" />
              )}
              <span>
                {isExtractingParties 
                  ? "Preparing Analysis..." 
                  : (getDocument?.status === 'processing' && !getDocument?.content) 
                    ? "Processing Document..." 
                    : "Analyze Document"}
              </span>
            </Button>

            <Button
              onClick={handleChat}
              className="flex flex-col items-center justify-center h-20 sm:h-24 gap-2 w-full"
              variant="outline"
            >
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
              <span>Chat with Document</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Options Dialog */}
      {documentId && (
        <AnalysisOptionsDialog
          isOpen={isAnalysisOptionsOpen}
          onClose={() => setIsAnalysisOptionsOpen(false)}
          documentId={documentId as Id<"documents">}
        />
      )}
    </>
  )
}
