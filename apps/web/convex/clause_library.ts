import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all clause templates with filtering and pagination
 * @param {Object} args - Query arguments
 * @param {number} args.limit - Number of clauses to return
 * @param {number} args.offset - Number of clauses to skip
 * @param {string} args.category - Filter by clause category
 * @param {boolean} args.isActive - Filter by active status
 * @returns {Promise<Object>} Clauses and total count
 */
export const getClauseTemplates = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, offset = 0, category, isActive = true } = args;

    let query = ctx.db
      .query("clause_library")
      .filter((q) => q.eq(q.field("isActive"), isActive));

    // Apply filters
    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    const clauses = await query.order("desc").take(limit + offset);
    const paginatedClauses = clauses.slice(offset, offset + limit);

    // Get author information for each clause
    const clausesWithAuthors = await Promise.all(
      paginatedClauses.map(async (clause) => {
        const author = await ctx.db.get(clause.authorId);
        return {
          ...clause,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return {
      clauses: clausesWithAuthors,
      total: clauses.length,
      hasMore: clauses.length > offset + limit,
    };
  },
});

/**
 * Query to get a single clause template by ID
 * @param {Object} args - Query arguments
 * @param {string} args.id - Clause ID
 * @returns {Promise<Object|null>} Clause with author information
 */
export const getClauseTemplate = query({
  args: { id: v.id("clause_library") },
  handler: async (ctx, args) => {
    const clause = await ctx.db.get(args.id);
    if (!clause) return null;

    // Get author information
    const author = await ctx.db.get(clause.authorId);

    return {
      ...clause,
      author: author ? { name: author.name, email: author.email } : null,
    };
  },
});

/**
 * Mutation to create a new clause template (admin only)
 * @param {Object} args - Clause data
 * @returns {Promise<string>} Created clause ID
 */
export const createClauseTemplate = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // TODO: Add admin role check
    const author = await ctx.db.get(args.authorId);
    if (!author || author.role !== "admin") {
      throw new Error("Only administrators can create clause templates");
    }

    const clauseId = await ctx.db.insert("clause_library", {
      ...args,
      usageCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return clauseId;
  },
});

/**
 * Mutation to update an existing clause template (admin only)
 * @param {Object} args - Clause update data
 * @returns {Promise<string>} Updated clause ID
 */
export const updateClauseTemplate = mutation({
  args: {
    id: v.id("clause_library"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();

    const existingClause = await ctx.db.get(id);
    if (!existingClause) {
      throw new Error("Clause template not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    return id;
  },
});

/**
 * Mutation to increment clause usage count
 * @param {Object} args - Clause ID
 * @returns {Promise<void>}
 */
export const incrementClauseUsage = mutation({
  args: { id: v.id("clause_library") },
  handler: async (ctx, args) => {
    const clause = await ctx.db.get(args.id);
    if (!clause) {
      throw new Error("Clause template not found");
    }

    await ctx.db.patch(args.id, {
      usageCount: clause.usageCount + 1,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Mutation to delete a clause template (admin only)
 * @param {Object} args - Clause ID
 * @returns {Promise<void>}
 */
export const deleteClauseTemplate = mutation({
  args: { id: v.id("clause_library") },
  handler: async (ctx, args) => {
    const clause = await ctx.db.get(args.id);
    if (!clause) {
      throw new Error("Clause template not found");
    }

    // Soft delete by marking as inactive
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Query to get clause categories with counts
 * @returns {Promise<Array>} Categories with clause counts
 */
export const getClauseCategories = query({
  args: {},
  handler: async (ctx) => {
    const clauses = await ctx.db
      .query("clause_library")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const categoryCounts = clauses.reduce(
      (acc, clause) => {
        acc[clause.category] = (acc[clause.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  },
});

/**
 * Query to get popular clause templates
 * @param {Object} args - Query arguments
 * @param {number} args.limit - Number of popular clauses to return
 * @returns {Promise<Array>} Popular clause templates
 */
export const getPopularClauseTemplates = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 10 } = args;

    const clauses = await ctx.db
      .query("clause_library")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(limit);

    // Sort by usage count
    const sortedClauses = clauses.sort((a, b) => b.usageCount - a.usageCount);

    // Get author information for each clause
    const clausesWithAuthors = await Promise.all(
      sortedClauses.map(async (clause) => {
        const author = await ctx.db.get(clause.authorId);
        return {
          ...clause,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return clausesWithAuthors;
  },
});
