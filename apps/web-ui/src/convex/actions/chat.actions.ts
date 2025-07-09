"use node";

import { action } from "@/convex/_generated/server";
import { v } from "convex/values";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const embeddings = new GoogleGenerativeAIEmbeddings();

export const chat = action({
  args: {
    documentId: v.id("documents"),
    message: v.string(),
    previousMessages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        references: v.optional(
          v.array(
            v.object({
              page: v.number(),
              text: v.string(),
            })
          )
        ),
      })
    ),
  },
  handler: async (
    ctx,
    { documentId, message, previousMessages }
  ): Promise<{
    role: "assistant";
    content: string;
    references: {
      page: any; text: string 
}[];
  }> => {
    // 1. Get document and check access
    const document = await ctx.runQuery(api.documents.getDocument, { documentId });
    if (!document || !document.vectorEmbedding) {
      throw new Error("Document not found or not processed");
    }

    // 2. Get message embedding for similarity search
    const messageEmbedding = await embeddings.embedQuery(message);

    // 3. Perform similarity search using dot product
    const { dotProduct, cleanAIResponseText } = await import("@/lib/utils");
    const similarity = dotProduct(messageEmbedding, document.vectorEmbedding);

    // 4. Format conversation history (if any)
    const conversationHistory = previousMessages.length > 0
      ? previousMessages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n")
      : "No previous conversation.";

    // 5. Generate response using Google Generative AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a helpful AI assistant analyzing a document. Please answer the user's question by returning a single JSON object in the following format:
      {\n  \"content\": string,\n  \"references\"?: [\n    {\n      \"page\": number,\n      \"text\": string\n    }\n  ]\n}\nYou may add other relevant fields if useful, but you must always include 'content' and, if possible, 'references' as described above.\n\nSTRICT RULES:\n- Do NOT use the exact same wording from the document. Paraphrase and synthesize the information to create a new paragraph.\n- Do NOT mention page numbers or roman numerals in the content.\n- In the 'references' array, the 'text' field must be a single, meaningful line (up to 200 characters) from the relevant section of the document. Do NOT use just one or two words; provide a full line that best represents the referenced information.\n- Do NOT provide more than 5 references in the 'references' array.\n\nContext from the document:\n${document.content}\n\n${previousMessages.length > 0 ? `Previous conversation:\n${conversationHistory}\n` : ''}\nUser's question: ${message}\n\nInstructions:\n1. Directly answer the user's question using the most relevant information from the document.\n2. Use specific information from the document context to support your answer.\n3. Be clear, concise, and easy to understand.\n4. When citing information from the document, include only the 'text' field in references as a single, meaningful line (up to 200 characters).\n5. Output ONLY a valid JSON object as described above, nothing else. Do NOT wrap your response in Markdown or any code block.\n${previousMessages.length === 0 ? '6. Treat this as a fresh conversation without any prior context.' : ''}\n`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Pre-process: Clean the AI response text using helper
    let cleanText = cleanAIResponseText(text);

    // Parse the AI's JSON response directly
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      throw new Error("AI response was not valid JSON: " + text);
    }

    return {
      role: "assistant" as const,
      ...parsed
    };
  },
});

