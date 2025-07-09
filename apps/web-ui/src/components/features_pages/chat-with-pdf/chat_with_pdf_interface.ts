export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: {
    page: number;
    text: string;
  }[];
}

export interface ChatResponse {
  role: "assistant";
  content: string;
  references?: {
    page: number;
    text: string;
  }[];
}