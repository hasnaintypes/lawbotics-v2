"use client";

import { ChatInterface } from "@/components/feature-pages/chat";
import { LoadingSpinner } from "@/components/shared";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useDocument } from "@/lib/document-utils";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as Id<"documents">;
  const document = useDocument(documentId);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 overflow-hidden">
      {document ? (
        <ChatInterface
          documentId={documentId}
          documentUrl={document.fileUrl || "Document"}
        />
      ) : (
        <LoadingSpinner
          title="Loading Chat Interface"
          description="Fetching your documents"
          subtitle="Please wait while we prepare your data"
        />
      )}
    </div>
  );
}
