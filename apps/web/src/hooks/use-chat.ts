"use client";
import { useState, useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery, useAction } from "convex/react";

interface Message {
  role: "user" | "assistant";
  content: string;
  references?: { page: number; text: string }[];
}

export function useChat(documentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Optionally, fetch document info for viewer logic
  const document = useQuery(
    api.documents.getDocument,
    documentId ? { documentId: documentId as Id<"documents"> } : "skip"
  );

  const chatAction = useAction(api.actions.chat.chat);
  if (!chatAction) {
    throw new Error(
      "Chat action not found. Ensure it is defined in your Convex actions."
    );
  }
  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      try {
        const response = await chatAction({
          documentId: documentId as Id<"documents">,
          message,
          previousMessages: [...messages, { role: "user", content: message }],
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.content,
            references: response.references,
          },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [chatAction, documentId, messages]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    document, // for viewer logic
  };
}
