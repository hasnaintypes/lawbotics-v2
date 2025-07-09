import { v } from "convex/values"
import { internalMutation } from "./_generated/server"
import { ConvexError } from "convex/values"

// Internal mutation to update document content and embedding
export const updateDocumentContent = internalMutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    vectorEmbedding: v.array(v.number()),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      throw new ConvexError("Document not found")
    }

    await ctx.db.patch(args.documentId, {
      content: args.content,
      vectorEmbedding: args.vectorEmbedding,
      status: args.status,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

// Internal mutation to update document status
export const updateDocumentStatus = internalMutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      throw new ConvexError("Document not found")
    }

    await ctx.db.patch(args.documentId, {
      status: args.status,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})
