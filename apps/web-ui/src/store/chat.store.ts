import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
  references?: { page: number; text: string }[];
};

interface ChatStoreState {
  chats: Record<string, ChatMessage[]>; // documentId -> messages
  addMessage: (documentId: string, message: ChatMessage) => void;
  setMessages: (documentId: string, messages: ChatMessage[]) => void;
  clearChat: (documentId: string) => void;
  getMessages: (documentId: string) => ChatMessage[];
  clearIfNoNewMessage: (documentId: string, lastKnownLength: number) => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      chats: {},
      addMessage: (documentId, message) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [documentId]: [...(state.chats[documentId] || []), message],
          },
        })),
      setMessages: (documentId, messages) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [documentId]: messages,
          },
        })),
      clearChat: (documentId) =>
        set((state) => {
          const newChats = { ...state.chats };
          delete newChats[documentId];
          return { chats: newChats };
        }),
      getMessages: (documentId) => {
        return get().chats[documentId] || [];
      },
      clearIfNoNewMessage: (documentId, lastKnownLength) => {
        const current = get().chats[documentId] || [];
        if (current.length === lastKnownLength) {
          set((state) => {
            const newChats = { ...state.chats };
            delete newChats[documentId];
            return { chats: newChats };
          });
        }
      },
    }),
    {
      name: "chat-messages-storage",
      partialize: (state) => ({ chats: state.chats }),
      version: 1,
    }
  )
);