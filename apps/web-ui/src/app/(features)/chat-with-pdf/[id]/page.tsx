"use client"

import { ChatWithPdfInterface } from "@/components/features_pages/chat-with-pdf";
import { useParams } from "next/navigation";
import { useDocument } from "@/services/document_service";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatWithPdfPage() {
  const params = useParams();
  const documentId = params.id as Id<"documents">;
  const document = useDocument(documentId);
 
 

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-muted-foreground/20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <ChatWithPdfInterface 
        documentId={documentId} 
        documentUrl={document.fileUrl} 
        documentName={document.title} 
      />
    </div>
  );
}
