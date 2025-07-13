import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new analysis for a document
 * @param documentId - The ID of the document to analyze
 * @param partyPerspective - The perspective from which to analyze the document
 * @param analysisBias - The bias to apply during analysis
 * @return The ID of the created analysis
 */
export const createAnalysis = mutation({
  args: {
    documentId: v.id("documents"),
    partyPerspective: v.string(),
    analysisBias: v.union(
      v.literal("neutral"),
      v.literal("favorable"),
      v.literal("risk")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      documentId: args.documentId,
      partyPerspective: args.partyPerspective,
      analysisBias: args.analysisBias,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Updates an analysis with the complete result
 * @param analysisId - The ID of the analysis to update
 * @param result - The analysis result data
 * @return Success confirmation
 */
export const updateAnalysisWithResult = mutation({
  args: {
    analysisId: v.id("analyses"),
    result: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.analysisId, {
      status: "complete",
      ...args.result,
    });
  },
});

/**
 * Updates the status of an analysis
 * @param analysisId - The ID of the analysis to update
 * @param status - The new status for the analysis
 * @return Success confirmation
 */
export const updateAnalysisStatus = mutation({
  args: {
    analysisId: v.id("analyses"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.analysisId, {
      status: args.status,
    });
  },
});

/**
 * Retrieves a specific analysis by its ID
 * @param analysisId - The ID of the analysis to retrieve
 * @return The analysis object or null if not found
 */
export const getAnalysis = query({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.analysisId);
  },
});

/**
 * Gets the most recent analysis for a specific document
 * @param documentId - The ID of the document to get the latest analysis for
 * @return The most recent analysis for the document or null if none exists
 */
export const getLatestAnalysisForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyses")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .first();
  },
});

/**
 * Gets the latest unique analysis for each document owned by a user
 * Returns one analysis per unique document title, with the most recent analysis for each title
 * @param userId - The Clerk user ID
 * @return Array of the latest analyses, one per unique document title
 */
export const getLatestUniqueAnalysesForUser = query({
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
      .collect();

    if (documents.length === 0) {
      return [];
    }

    const latestAnalysesMap = new Map();

    for (const doc of documents) {
      const analysesForDocument = await ctx.db
        .query("analyses")
        .withIndex("by_document", (q) => q.eq("documentId", doc._id))
        .order("desc")
        .collect();

      if (analysesForDocument.length > 0) {
        const latestAnalysisForThisDocument = analysesForDocument[0];

        if (
          latestAnalysisForThisDocument.document &&
          latestAnalysisForThisDocument.document.title
        ) {
          const existingAnalysis = latestAnalysesMap.get(
            latestAnalysisForThisDocument.document.title
          );
          const analysisWithAuthor = {
            ...latestAnalysisForThisDocument,
            author: user.name,
          };

          if (existingAnalysis) {
            if (
              latestAnalysisForThisDocument.createdAt >
              existingAnalysis.createdAt
            ) {
              latestAnalysesMap.set(
                latestAnalysisForThisDocument.document.title,
                analysisWithAuthor
              );
            }
          } else {
            latestAnalysesMap.set(
              latestAnalysisForThisDocument.document.title,
              analysisWithAuthor
            );
          }
        }
      }
    }

    return Array.from(latestAnalysesMap.values());
  },
});

/**
 * Deletes all analyses associated with a specific document
 * @param documentId - The ID of the document whose analyses should be deleted
 * @return The number of analyses deleted
 */
export const deleteAllAnalysesForDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const analysis of analyses) {
      await ctx.db.delete(analysis._id);
    }

    return analyses.length;
  },
});

/**
 * Deletes a specific analysis by its ID
 * @param analysisId - The ID of the analysis to delete
 * @return Success confirmation
 */
export const deleteAnalysis = mutation({
  args: {
    analysisId: v.id("analyses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.analysisId);
  },
});
