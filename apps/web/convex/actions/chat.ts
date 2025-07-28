"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Using centralized prompts from convex/prompts.ts
// The prompt template is fetched using: await ctx.runQuery(api.prompts.getChatPrompt, {})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const embeddings = new GoogleGenerativeAIEmbeddings();

/**
 * Handles chat interactions with a specific document using Google Generative AI
 * Performs semantic similarity search and generates contextual responses
 * Maintains conversation history and provides document references
 *
 * @param documentId - The ID of the document to chat about
 * @param message - The user's message/question
 * @param previousMessages - Array of previous conversation messages with roles and content
 * @return Assistant response with content and document references
 */
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
      page: any;
      text: string;
    }[];
  }> => {
    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId,
    });
    if (!document || !document.vectorEmbedding) {
      throw new Error("Document not found or not processed");
    }

    const messageEmbedding = await embeddings.embedQuery(message);

    const { dotProduct, cleanAIResponseText } = await import("@/lib/utils");
    const similarity = dotProduct(messageEmbedding, document.vectorEmbedding);

    const conversationHistory =
      previousMessages.length > 0
        ? previousMessages
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")
        : "No previous conversation.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get the centralized chat prompt template
    const promptTemplate = await ctx.runQuery(api.prompts.getChatPrompt, {});

    // Replace placeholders in the template
    const finalPrompt = promptTemplate
      .replace("{{DOCUMENT_CONTENT}}", document.content)
      .replace(
        "{{CONVERSATION_HISTORY}}",
        previousMessages.length > 0
          ? `Previous conversation:\n${conversationHistory}\n`
          : ""
      )
      .replace("{{USER_MESSAGE}}", message)
      .replace(
        "{{FRESH_CONVERSATION_INSTRUCTION}}",
        previousMessages.length === 0
          ? "6. Treat this as a fresh conversation without any prior context."
          : ""
      );

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = await response.text();

    let cleanText = cleanAIResponseText(text);

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      throw new Error("AI response was not valid JSON: " + text);
    }

    return {
      role: "assistant" as const,
      ...parsed,
    };
  },
});
