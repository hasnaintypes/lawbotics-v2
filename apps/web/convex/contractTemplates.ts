import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Contract Templates Convex Functions
 *
 * These functions handle CRUD operations for contract templates
 * intended to be managed by admin users through a separate admin dashboard.
 * Templates define the structure, fields, and content for different contract types.
 */

/**
 * Create a new contract template (Admin only)
 */
export const createTemplate = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isActive: v.boolean(),
    formFields: v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        type: v.union(
          v.literal("text"),
          v.literal("email"),
          v.literal("tel"),
          v.literal("date"),
          v.literal("select"),
          v.literal("textarea"),
          v.literal("number")
        ),
        required: v.boolean(),
        placeholder: v.optional(v.string()),
        options: v.optional(v.array(v.string())),
        validation: v.optional(
          v.object({
            minLength: v.optional(v.number()),
            maxLength: v.optional(v.number()),
            pattern: v.optional(v.string()),
          })
        ),
        section: v.optional(v.string()),
        order: v.number(),
      })
    ),
    clauses: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        content: v.string(),
        defaultEnabled: v.boolean(),
        optional: v.boolean(),
        category: v.optional(v.string()),
        order: v.number(),
      })
    ),
    content: v.string(),
    metadata: v.optional(
      v.object({
        jurisdiction: v.optional(v.string()),
        language: v.optional(v.string()),
        version: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin (you'll need to implement admin check)
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Check if slug already exists
    const existingTemplate = await ctx.db
      .query("contractTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existingTemplate) {
      throw new Error("Template with this slug already exists");
    }

    const templateId = await ctx.db.insert("contractTemplates", {
      ...args,
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return templateId;
  },
});

/**
 * Update an existing contract template (Admin only)
 */
export const updateTemplate = mutation({
  args: {
    templateId: v.id("contractTemplates"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    formFields: v.optional(
      v.array(
        v.object({
          id: v.string(),
          label: v.string(),
          type: v.union(
            v.literal("text"),
            v.literal("email"),
            v.literal("tel"),
            v.literal("date"),
            v.literal("select"),
            v.literal("textarea"),
            v.literal("number")
          ),
          required: v.boolean(),
          placeholder: v.optional(v.string()),
          options: v.optional(v.array(v.string())),
          validation: v.optional(
            v.object({
              minLength: v.optional(v.number()),
              maxLength: v.optional(v.number()),
              pattern: v.optional(v.string()),
            })
          ),
          section: v.optional(v.string()),
          order: v.number(),
        })
      )
    ),
    clauses: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          content: v.string(),
          defaultEnabled: v.boolean(),
          optional: v.boolean(),
          category: v.optional(v.string()),
          order: v.number(),
        })
      )
    ),
    content: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        jurisdiction: v.optional(v.string()),
        language: v.optional(v.string()),
        version: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const { templateId, ...updateData } = args;

    await ctx.db.patch(templateId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get a template by slug (Public)
 */
export const getTemplateBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("contractTemplates")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!template || !template.isActive) {
      return null;
    }

    return template;
  },
});

/**
 * Get all active templates (Public)
 */
export const getActiveTemplates = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("contractTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return templates.map((template) => ({
      id: template._id,
      slug: template.slug,
      title: template.title,
      description: template.description,
      category: template.category,
      metadata: template.metadata,
    }));
  },
});

/**
 * Get templates by category (Public)
 */
export const getTemplatesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("contractTemplates")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return templates;
  },
});

/**
 * Get all templates for admin management
 */
export const getAllTemplates = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    return await ctx.db.query("contractTemplates").collect();
  },
});

/**
 * Delete a template (Admin only)
 */
export const deleteTemplate = mutation({
  args: { templateId: v.id("contractTemplates") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.delete(args.templateId);
    return { success: true };
  },
});
