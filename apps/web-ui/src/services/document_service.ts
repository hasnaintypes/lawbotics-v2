import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import type { Id } from "@/convex/_generated/dataModel"

export async function uploadDocument(
  convex: any,
  file: File,
  userId: string,
): Promise<{ documentId: Id<"documents">; success: boolean; error?: string }> {
  try {
    // 1. Create document record - pass the Clerk userId
    const documentId = await convex.mutation(api.documents.createDocument, {
      title: file.name,
      userId: userId, // Changed from ownerId to userId for clarity
      fileType: file.type,
      fileSize: file.size,
    })

    // 2. Get upload URL
    const { uploadUrl } = await convex.mutation(api.documents.generateUploadUrl, {
      documentId,
    })

    // 3. Upload file to storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    })

    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.statusText}`)
    }

    const { storageId } = await result.json()

    // 4. Update document with file URL and trigger processing
    await convex.mutation(api.documents.updateDocumentWithFileUrl, {
      documentId,
      storageId,
    })

    return { documentId, success: true }
  } catch (error) {
    console.error("Error uploading document:", error)
    return {
      documentId: "" as Id<"documents">,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function useDocuments(userId: string) {
  return useQuery(api.documents.getDocuments, { userId })
}

export function useDocument(documentId: Id<"documents">) {
  return useQuery(api.documents.getDocument, { documentId })
}

export function useDeleteDocument() {
  return useMutation(api.documents.deleteDocument)
}
