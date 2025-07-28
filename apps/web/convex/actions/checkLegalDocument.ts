"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { ConvexError } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Checks if a document is a legal document using Gemini and updates the document record.
 * @param documentId - The ID of the document to check
 */
export const checkLegalDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const doc = await ctx.runQuery(api.documents.getDocument, { documentId });
    if (!doc || !doc.content)
      throw new ConvexError("Document not found or has no content");

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) throw new Error("GOOGLE_API_KEY not set");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Is the following document a legal document? Answer 'yes' or 'no'.\n\n${doc.content.slice(0, 20000)}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const geminiText = await response.text();
      if (/no/i.test(geminiText)) {
        // Delete the document if not legal
        await ctx.runMutation(api.documents.deleteDocument, { documentId });
        return { deleted: true };
      }
      // Do nothing if legal or unknown
      return { deleted: false };
    } catch (err) {
      // Do not delete on error, just log
      console.error("Error in Gemini legal check:", err);
      return {
        deleted: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});
