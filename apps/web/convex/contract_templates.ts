import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all contract templates with filtering and pagination
 * @param {Object} args - Query arguments
 * @param {number} args.limit - Number of templates to return
 * @param {number} args.offset - Number of templates to skip
 * @param {string} args.category - Filter by template category
 * @param {string} args.type - Filter by template type
 * @returns {Promise<Object>} Templates and total count
 */
export const getTemplates = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { limit = 10, offset = 0, category, type } = args;

    let query = ctx.db
      .query("contract_templates")
      .filter((q) => q.eq(q.field("isActive"), true));

    // Apply filters
    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }
    if (type) {
      query = query.filter((q) => q.eq(q.field("type"), type));
    }

    const templates = await query.order("desc").take(limit + offset);
    const paginatedTemplates = templates.slice(offset, offset + limit);

    // Get author information for each template
    const templatesWithAuthors = await Promise.all(
      paginatedTemplates.map(async (template) => {
        const author = await ctx.db.get(template.authorId);
        return {
          ...template,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return {
      templates: templatesWithAuthors,
      total: templates.length,
      hasMore: templates.length > offset + limit,
    };
  },
});

/**
 * Query to get a single template by ID
 * @param {Object} args - Query arguments
 * @param {string} args.id - Template ID
 * @returns {Promise<Object|null>} Template with author information
 */
export const getTemplate = query({
  args: { id: v.id("contract_templates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) return null;

    // Get author information
    const author = await ctx.db.get(template.authorId);

    return {
      ...template,
      author: author ? { name: author.name, email: author.email } : null,
    };
  },
});

/**
 * Mutation to create a new contract template
 * @param {Object} args - Template data
 * @returns {Promise<string>} Created template ID
 */
export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    type: v.union(
      v.literal("nda"),
      v.literal("service_agreement"),
      v.literal("employment"),
      v.literal("lease"),
      v.literal("purchase"),
      v.literal("partnership"),
      v.literal("licensing"),
      v.literal("consulting"),
      v.literal("vendor"),
      v.literal("custom")
    ),
    content: v.string(),
    variables: v.array(
      v.object({
        name: v.string(),
        type: v.union(
          v.literal("text"),
          v.literal("number"),
          v.literal("date"),
          v.literal("select")
        ),
        required: v.boolean(),
        placeholder: v.optional(v.string()),
        options: v.optional(v.array(v.string())),
      })
    ),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const templateId = await ctx.db.insert("contract_templates", {
      ...args,
      usageCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return templateId;
  },
});

/**
 * Mutation to update an existing template
 * @param {Object} args - Template update data
 * @returns {Promise<string>} Updated template ID
 */
export const updateTemplate = mutation({
  args: {
    id: v.id("contract_templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    content: v.optional(v.string()),
    variables: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.union(
            v.literal("text"),
            v.literal("number"),
            v.literal("date"),
            v.literal("select")
          ),
          required: v.boolean(),
          placeholder: v.optional(v.string()),
          options: v.optional(v.array(v.string())),
        })
      )
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();

    const existingTemplate = await ctx.db.get(id);
    if (!existingTemplate) {
      throw new Error("Template not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    return id;
  },
});

/**
 * Mutation to increment template usage count
 * @param {Object} args - Template ID
 * @returns {Promise<void>}
 */
export const incrementTemplateUsage = mutation({
  args: { id: v.id("contract_templates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    await ctx.db.patch(args.id, {
      usageCount: template.usageCount + 1,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Mutation to delete a template
 * @param {Object} args - Template ID
 * @returns {Promise<void>}
 */
export const deleteTemplate = mutation({
  args: { id: v.id("contract_templates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    // Soft delete by marking as inactive
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Query to get template categories with counts
 * @returns {Promise<Array>} Categories with template counts
 */
export const getTemplateCategories = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("contract_templates")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const categoryCounts = templates.reduce(
      (acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1;
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
