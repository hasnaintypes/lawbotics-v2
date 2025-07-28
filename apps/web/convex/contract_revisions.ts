import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all revisions for a specific contract
 * @param {Object} args - Query arguments
 * @param {string} args.contractId - Contract ID
 * @returns {Promise<Array>} Contract revisions with author info
 */
export const getContractRevisions = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const revisions = await ctx.db
      .query("contract_revisions")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .order("desc")
      .collect();

    // Get author information for each revision
    const revisionsWithAuthors = await Promise.all(
      revisions.map(async (revision) => {
        const author = await ctx.db.get(revision.authorId);
        return {
          ...revision,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return revisionsWithAuthors;
  },
});

/**
 * Query to get a specific contract revision
 * @param {Object} args - Query arguments
 * @param {string} args.contractId - Contract ID
 * @param {string} args.version - Version number
 * @returns {Promise<Object|null>} Contract revision
 */
export const getContractRevision = query({
  args: {
    contractId: v.id("contracts"),
    version: v.string(),
  },
  handler: async (ctx, args) => {
    const revision = await ctx.db
      .query("contract_revisions")
      .withIndex("by_version", (q) =>
        q.eq("contractId", args.contractId).eq("version", args.version)
      )
      .first();

    if (!revision) return null;

    // Get author information
    const author = await ctx.db.get(revision.authorId);

    return {
      ...revision,
      author: author ? { name: author.name, email: author.email } : null,
    };
  },
});

/**
 * Mutation to create a new contract revision
 * @param {Object} args - Revision data
 * @returns {Promise<string>} Created revision ID
 */
export const createContractRevision = mutation({
  args: {
    contractId: v.id("contracts"),
    version: v.string(),
    content: v.string(),
    summary: v.string(),
    changes: v.array(
      v.object({
        field: v.string(),
        oldValue: v.optional(v.string()),
        newValue: v.string(),
        description: v.optional(v.string()),
      })
    ),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const revisionId = await ctx.db.insert("contract_revisions", {
      ...args,
      createdAt: now,
    });

    return revisionId;
  },
});

/**
 * Query to compare two contract versions
 * @param {Object} args - Comparison arguments
 * @param {string} args.contractId - Contract ID
 * @param {string} args.version1 - First version
 * @param {string} args.version2 - Second version
 * @returns {Promise<Object>} Comparison result
 */
export const compareContractVersions = query({
  args: {
    contractId: v.id("contracts"),
    version1: v.string(),
    version2: v.string(),
  },
  handler: async (ctx, args) => {
    const [revision1, revision2] = await Promise.all([
      ctx.db
        .query("contract_revisions")
        .withIndex("by_version", (q) =>
          q.eq("contractId", args.contractId).eq("version", args.version1)
        )
        .first(),
      ctx.db
        .query("contract_revisions")
        .withIndex("by_version", (q) =>
          q.eq("contractId", args.contractId).eq("version", args.version2)
        )
        .first(),
    ]);

    if (!revision1 || !revision2) {
      throw new Error("One or both versions not found");
    }

    // TODO: Implement actual content comparison logic
    // For now, return the changes from the newer revision
    const newerRevision =
      revision1.createdAt > revision2.createdAt ? revision1 : revision2;

    return {
      changes: newerRevision.changes,
      summary: `Comparison between v${args.version1} and v${args.version2}`,
      olderVersion:
        revision1.createdAt < revision2.createdAt ? revision1 : revision2,
      newerVersion: newerRevision,
    };
  },
});
