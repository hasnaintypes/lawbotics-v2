"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, Maximize, Minimize, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string
  currentPage: number
  totalPages: number
  zoom: number
  isFullscreen: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onNextPage: () => void
  onPrevPage: () => void
  onToggleFullscreen: () => void
  onDocumentLoad?: (numPages: number) => void
}

export function PdfViewer({
  url,
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  onZoomIn,
  onZoomOut,
  onNextPage,
  onPrevPage,
  onToggleFullscreen,
  onDocumentLoad,
}: PdfViewerProps) {
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setIsLoading(false)
    setLoadError(false)
    if (onDocumentLoad) {
      onDocumentLoad(numPages)
    }
  }

  function onDocumentLoadError(error: Error) {
    console.error("Failed to load PDF:", error)
    setIsLoading(false)
    setLoadError(true)
  }

  // Reset loading state when URL changes
  useEffect(() => {
    if (!url) {
      setLoadError(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(false)

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setLoadError(true)
        setIsLoading(false)
      }
    }, 15000) // 15 seconds timeout

    return () => clearTimeout(timeoutId)
  }, [url, isLoading])

  function handleRotate() {
    setRotation((prevRotation) => (prevRotation + 90) % 360)
  }

  return (
    <div className="h-full border-r relative bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="absolute top-4 right-4 z-10">

      </div>

      <div ref={containerRef} className="flex items-center justify-center flex-1 overflow-auto p-2 sm:p-4 w-full">
        {isLoading && !loadError && !url && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-muted-foreground/20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-destructive mb-2">Failed to load PDF</p>
            <p className="text-xs text-muted-foreground mb-4">
              {!url ? "No document URL provided" : "Please check if the document is accessible"}
            </p>
            {url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true)
                  setLoadError(false)
                  // Force reload the document
                  const reloadUrl = new URL(url)
                  reloadUrl.searchParams.set('reload', Date.now().toString())
                  window.location.href = reloadUrl.toString()
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        {!loadError && url && (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="flex justify-center"
          >
            <Page
              pageNumber={currentPage}
              scale={zoom / 100}
              rotate={rotation}
              className="shadow-lg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      <PdfControls
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onRotate={handleRotate}
      />
    </div>
  )
}

interface PdfControlsProps {
  currentPage: number
  totalPages: number
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onNextPage: () => void
  onPrevPage: () => void
  onRotate: () => void
}

function PdfControls({
  currentPage,
  totalPages,
  zoom,
  onZoomIn,
  onZoomOut,
  onNextPage,
  onPrevPage,
  onRotate,
}: PdfControlsProps) {
  return (
    <div className="sticky bottom-4 mx-auto flex items-center gap-1 sm:gap-2 bg-background/90 backdrop-blur rounded-full px-2 sm:px-3 py-1.5 shadow-md z-10 w-[calc(100%-2rem)] max-w-[480px] overflow-x-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-xs font-medium">{zoom}%</span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous Page</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-xs font-medium min-w-[60px] text-center">
        {currentPage} / {totalPages}
      </span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next Page</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
