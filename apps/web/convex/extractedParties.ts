import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

/**
 * Stores extracted parties information for a document
 * @param documentId - The ID of the document to store parties for
 * @param parties - Array of party names extracted from the document
 * @return The ID of the created extractedParties record
 */
export const storeExtractedParties = mutation({
  args: {
    documentId: v.id("documents"),
    parties: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("extractedParties", {
      documentId: args.documentId,
      parties: args.parties,
      createdAt: Date.now(),
    })
  },
})

/**
 * Retrieves the most recently extracted parties for a document
 * @param documentId - The ID of the document to get parties for
 * @return Array of party names or empty array if no parties found
 */
export const getExtractedParties = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("extractedParties")
      .withIndex("by_document", q => q.eq("documentId", args.documentId))
      .order("desc")
      .first();
    return record ? record.parties : [];
  },
});
