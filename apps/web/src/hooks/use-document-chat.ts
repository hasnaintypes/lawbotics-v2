"use client";
import { useRouter } from "next/navigation";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Custom hook for document chat operations
 *
 * Provides functionality for starting chat sessions with documents.
 * Centralizes chat-related navigation and state management for
 * consistent behavior across components.
 *
 * @returns Chat operations and state
 *
 * @example
 * ```typescript
 * const { startChat, isStartingChat } = useDocumentChat();
 *
 * // Start chat with a document
 * startChat(documentId);
 * ```
 */
export function useDocumentChat() {
  const router = useRouter();

  /**
   * Start a chat session with a document
   *
   * @param documentId - The ID of the document to chat with
   */
  const startChat = (documentId: Id<"documents">) => {
    try {
      // Navigate to chat page with document ID as path parameter
      router.push(`/chat/${documentId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return {
    // Actions
    startChat,
  };
}
