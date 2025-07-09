import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

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
