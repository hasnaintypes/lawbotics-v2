"use client";

import { ChatInterface } from "@/components/feature-pages/chat";
import { LoadingSpinner } from "@/components/shared";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useDocument } from "@/lib/document-utils";

/**
 * Chat Page Component
 *
 * Main page component that handles document-based chat interface.
 * Includes header with document info and navigation controls.
 */
export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as Id<"documents">;

  const document = useDocument(documentId);

  /**
   * Format file size in human readable format
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  if (!document) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <LoadingSpinner
          title="Loading Chat Interface"
          description="Fetching your documents"
          subtitle="Please wait while we prepare your data"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section - Back button and document info */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    Chat with Document
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {document.title}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section - Chat actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.fileUrl, "_blank")}
                className="text-slate-600 hover:text-slate-900"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-slate-600 hover:text-slate-900"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          documentId={documentId}
          documentUrl={document.fileUrl || "Document"}
        />
      </div>
    </div>
  );
}
