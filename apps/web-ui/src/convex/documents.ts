import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"
import { processDocument } from "./actions/process_document.action"
import { api } from "./_generated/api"

// Query to get all documents for a user
export const getDocuments = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, get the user from our users table
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (!user) {
      return []
    }

    // Then get documents owned by this user
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect()

    return documents
  },
})

// Query to get a single document by ID
export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      throw new ConvexError("Document not found")
    }
    return document
  },
})

// Mutation to create a document record before upload
export const createDocument = mutation({
  args: {
    title: v.string(),
    userId: v.string(), // This is the Clerk userId
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate user exists in our database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (!user) {
      throw new ConvexError("User not found")
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: "", // Required by schema
      ownerId: user._id, // Store the Convex user ID, not the Clerk ID
      fileType: args.fileType,
      fileSize: args.fileSize,
      fileUrl: "", // Will be populated after upload
      status: "processing", // Required by schema
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return documentId
  },
})

// Mutation to generate upload URL
export const generateUploadUrl = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      throw new ConvexError("Document not found")
    }

    // Generate a URL for file upload
    const uploadUrl = await ctx.storage.generateUploadUrl()

    return { uploadUrl }
  },
})

// Mutation to update document with file URL
export const updateDocumentWithFileUrl = mutation({
  args: {
    documentId: v.id("documents"),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.documentId);
    if (!doc) {
      throw new ConvexError("Document not found");
    }

    // 1) Get the file URL
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new ConvexError("Failed to retrieve file URL");
    }

    // 2) Patch the document record - keep status as "processing"
    await ctx.db.patch(args.documentId, {
      fileUrl,
      status: "processing", // Keep as processing until the document is fully processed
      updatedAt: Date.now(),
    });

    // 3) Asynchronously kick off your processing action
    console.log(`[UpdateDocument] Starting document processing for ${args.documentId}`);
    ctx
      .scheduler.runAfter(0, api.actions.processDocument.processDocument, {
        documentId: args.documentId,
      })
      .catch((err: Error) => {
        console.error("Error processing document:", err);
        // Update status to failed if processing fails
        ctx.db.patch(args.documentId, {
          status: "failed",
          updatedAt: Date.now(),
        });
      });

    return args.documentId;
  },
});

// Mutation to delete a document
export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      throw new ConvexError("Document not found")
    }

    // Delete the document
    await ctx.db.delete(args.documentId)

    // If there's a file URL, delete from storage
    if (document.fileUrl) {
      // Extract storageId from URL if needed
      // await ctx.storage.delete(storageId);
    }

    return { success: true }
  },
})

// Mutation to update document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("failed"))),
    vectorEmbedding: v.optional(v.array(v.number())),
    content: v.optional(v.string()), 
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const updateData: any = {};
    if (args.status) updateData.status = args.status;
    if (args.vectorEmbedding) updateData.vectorEmbedding = args.vectorEmbedding;
    if (args.updatedAt) updateData.updatedAt = args.updatedAt;
    if (args.content) updateData.content = args.content; 


    await ctx.db.patch(args.documentId, updateData);
    return { success: true };
  },
});
