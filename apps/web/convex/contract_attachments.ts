import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all attachments for a specific contract
 * @param {Object} args - Query arguments
 * @param {string} args.contractId - Contract ID
 * @returns {Promise<Array>} Contract attachments with uploader info
 */
export const getContractAttachments = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const attachments = await ctx.db
      .query("contract_attachments")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .collect();

    // Get uploader information for each attachment
    const attachmentsWithUploaders = await Promise.all(
      attachments.map(async (attachment) => {
        const uploader = await ctx.db.get(attachment.uploadedBy);
        return {
          ...attachment,
          uploader: uploader
            ? { name: uploader.name, email: uploader.email }
            : null,
        };
      })
    );

    return attachmentsWithUploaders;
  },
});

/**
 * Mutation to add an attachment to a contract
 * @param {Object} args - Attachment data
 * @returns {Promise<string>} Created attachment ID
 */
export const addContractAttachment = mutation({
  args: {
    contractId: v.id("contracts"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    fileUrl: v.string(),
    description: v.optional(v.string()),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const attachmentId = await ctx.db.insert("contract_attachments", {
      ...args,
      createdAt: now,
    });

    return attachmentId;
  },
});

/**
 * Mutation to remove an attachment from a contract
 * @param {Object} args - Attachment ID
 * @returns {Promise<void>}
 */
export const removeContractAttachment = mutation({
  args: { id: v.id("contract_attachments") },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.id);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    // TODO: Delete file from storage

    await ctx.db.delete(args.id);
  },
});
