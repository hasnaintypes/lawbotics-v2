import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { processDocument } from "./actions/processDocument";
import { api } from "./_generated/api";

/**
 * Retrieves all documents owned by a specific user
 * @param userId - The Clerk user ID
 * @return Array of documents owned by the user
 */
export const getDocuments = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      return [];
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();

    return documents;
  },
});

/**
 * Retrieves a single document by its ID
 * @param documentId - The ID of the document to retrieve
 * @return The document object
 * @throws ConvexError if document is not found
 */
export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    return document;
  },
});

/**
 * Creates a new document record before file upload
 * @param title - The title of the document
 * @param userId - The Clerk user ID
 * @param fileType - The MIME type of the file
 * @param fileSize - The size of the file in bytes
 * @return The ID of the created document
 * @throws ConvexError if user is not found
 */
export const createDocument = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: "",
      ownerId: user._id,
      fileType: args.fileType,
      fileSize: args.fileSize,
      fileUrl: "",
      status: "processing",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

/**
 * Generates a URL for uploading a file associated with a document
 * @param documentId - The ID of the document to generate upload URL for
 * @return Object containing the upload URL
 * @throws ConvexError if document is not found
 */
export const generateUploadUrl = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();

    return { uploadUrl };
  },
});

/**
 * Updates a document with the file URL after upload and triggers processing
 * @param documentId - The ID of the document to update
 * @param storageId - The storage ID of the uploaded file
 * @return The document ID
 * @throws ConvexError if document is not found or file URL cannot be retrieved
 */
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

    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new ConvexError("Failed to retrieve file URL");
    }

    await ctx.db.patch(args.documentId, {
      fileUrl,
      status: "processing",
      updatedAt: Date.now(),
    });

    console.log(
      `[UpdateDocument] Starting document processing for ${args.documentId}`
    );
    ctx.scheduler
      .runAfter(0, api.actions.processDocument.processDocument, {
        documentId: args.documentId,
      })
      .catch((err: Error) => {
        console.error("Error processing document:", err);
        ctx.db.patch(args.documentId, {
          status: "failed",
          updatedAt: Date.now(),
        });
      });

    return args.documentId;
  },
});

/**
 * Deletes a document and optionally its associated file from storage
 * @param documentId - The ID of the document to delete
 * @return Success confirmation object
 * @throws ConvexError if document is not found
 */
export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    // Attempt to delete the file from storage if fileUrl exists
    if (document.fileUrl) {
      try {
        // Extract storageId from fileUrl (Convex storage URLs are of the form /api/storage/FILE_ID)
        const match = document.fileUrl.match(/\/api\/storage\/(.+)$/);
        if (match && match[1]) {
          const storageId = match[1];
          await ctx.storage.delete(storageId);
        }
      } catch (err) {
        // Log but do not block document deletion
        console.error("Failed to delete file from storage:", err);
      }
    }

    await ctx.db.delete(args.documentId);

    return { success: true };
  },
});

/**
 * Updates specific fields of a document
 * @param documentId - The ID of the document to update
 * @param status - Optional new status for the document
 * @param vectorEmbedding - Optional vector embedding array
 * @param content - Optional new content for the document
 * @param updatedAt - Optional timestamp for the update
 * @return Success confirmation object
 * @throws ConvexError if document is not found
 */
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
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
