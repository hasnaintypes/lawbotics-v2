"use client"

import * as React from "react"
import { X, FileText, AlertCircle, Upload, File, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { uploadDocument } from "@/services/document_service"
import { useConvex } from "convex/react"
import { useAuth } from "@clerk/nextjs"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (documentId: string) => void
}

export function UploadDialog({ open, onOpenChange, onUploadComplete }: UploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [progress, setProgress] = React.useState(0)
  const [uploading, setUploading] = React.useState(false)
  const [uploadComplete, setUploadComplete] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [documentId, setDocumentId] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const convex = useConvex()
  const { userId } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file.")
      return
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB.")
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file || !userId) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Check file type
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        throw new Error("DOCX files are not supported yet. Please convert to PDF or plain text.")
      }

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          // Cap at 90% until we get confirmation
          return prevProgress >= 90 ? 90 : prevProgress + 5
        })
      }, 300)

      // Upload to Convex
      const result = await uploadDocument(convex, file, userId)

      clearInterval(progressInterval)

      if (result.success) {
        setProgress(100)
        setDocumentId(result.documentId)
        setUploadComplete(true)

        toast.success("Your document is being processed.")

        if (onUploadComplete) {
          onUploadComplete(result.documentId)
        }

        // Auto close after success
        setTimeout(() => {
          handleClose()
        }, 1500)
      } else {
        setError(result.error || "Upload failed")
        setProgress(0)
        toast.error(result.error || "An error occurred during upload.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setProgress(0)
      toast.error(err instanceof Error ? err.message : "An error occurred during upload.")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setProgress(0)
    setUploading(false)
    setUploadComplete(false)
    setError(null)
    setDragActive(false)
    setDocumentId(null)
    onOpenChange(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (fileType.includes("word")) return <File className="h-5 w-5 text-blue-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF"
    if (fileType.includes("word")) return "DOCX"
    if (fileType.includes("text")) return "TXT"
    return "Unknown"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload a legal document for analysis. Supported formats: PDF, DOCX, TXT (max 10MB).
          </DialogDescription>
        </DialogHeader>

        {!file && !uploading && !uploadComplete && (
          <div className="grid w-full items-center gap-4">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="mb-4">
                <Upload className={`h-10 w-10 mx-auto ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium">
                  {dragActive ? "Drop your file here" : "Drag and drop your file here"}
                </p>
                <p className="text-xs text-muted-foreground">or click to browse your files</p>
              </div>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                Select File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
              />
              <div className="mt-4 flex gap-2">
                <Badge variant="outline" className="text-xs">
                  PDF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  DOCX
                </Badge>
                <Badge variant="outline" className="text-xs">
                  TXT
                </Badge>
              </div>
            </div>
          </div>
        )}

        {file && !uploading && !uploadComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  {getFileIcon(file.type)}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {getFileTypeLabel(file.type)}
                    </Badge>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
                  {file && getFileIcon(file.type)}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{file?.name}</div>
                  <div className="text-xs text-muted-foreground">Uploading... {progress}%</div>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {uploadComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <p className="font-medium text-green-800 dark:text-green-200">Upload Complete!</p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Your document has been successfully uploaded and is ready for analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={handleClose}>
            {uploadComplete ? "Close" : "Cancel"}
          </Button>
          {file && !uploading && !uploadComplete && <Button onClick={handleUpload}>Upload Document</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
