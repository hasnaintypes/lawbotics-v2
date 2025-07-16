/**
 * Represents a reference to a specific part of the document
 */
export interface DocumentReference {
  /** The page number where the reference is found */
  page: number;
  /** The text content of the reference */
  text: string;
}

/**
 * Represents a chat message in the conversation
 */
export interface Message {
  /** The role of the message sender */
  role: "user" | "assistant";
  /** The content of the message */
  content: string;
  /** Optional references to document sections */
  references?: DocumentReference[];
}

/**
 * Configuration for chat API requests
 */
export interface ChatConfig {
  /** The document ID being analyzed */
  documentId: string;
  /** The user's message */
  message: string;
  /** Previous messages in the conversation */
  previousMessages: Message[];
}
