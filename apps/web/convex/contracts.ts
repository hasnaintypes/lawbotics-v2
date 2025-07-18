import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all contracts with pagination and filtering
 * @param {Object} args - Query arguments
 * @param {number} args.limit - Number of contracts to return
 * @param {number} args.offset - Number of contracts to skip
 * @param {string} args.status - Filter by contract status
 * @param {string} args.type - Filter by contract type
 * @param {string} args.authorId - Filter by author ID
 * @returns {Promise<Object>} Contracts and total count
 */
export const getContracts = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    status: v.optional(v.string()),
    type: v.optional(v.string()),
    authorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { limit = 10, offset = 0, status, type, authorId } = args;

    let query = ctx.db.query("contracts");

    // Apply filters
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }
    if (type) {
      query = query.filter((q) => q.eq(q.field("type"), type));
    }
    if (authorId) {
      query = query.filter((q) => q.eq(q.field("authorId"), authorId));
    }

    const contracts = await query.order("desc").take(limit + offset);

    const paginatedContracts = contracts.slice(offset, offset + limit);

    // Get author information for each contract
    const contractsWithAuthors = await Promise.all(
      paginatedContracts.map(async (contract) => {
        const author = await ctx.db.get(contract.authorId);
        return {
          ...contract,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return {
      contracts: contractsWithAuthors,
      total: contracts.length,
      hasMore: contracts.length > offset + limit,
    };
  },
});

/**
 * Query to get a single contract by ID
 * @param {Object} args - Query arguments
 * @param {string} args.id - Contract ID
 * @returns {Promise<Object|null>} Contract with related data
 */
export const getContract = query({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (!contract) return null;

    // Get author information
    const author = await ctx.db.get(contract.authorId);

    // Get assigned user information
    const assignedUser = contract.assignedTo
      ? await ctx.db.get(contract.assignedTo)
      : null;

    // Get template information
    const template = contract.templateId
      ? await ctx.db.get(contract.templateId as Id<"contract_templates">)
      : null;

    // Get contract parties
    const parties = await ctx.db
      .query("contract_parties")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    // Get contract attachments
    const attachments = await ctx.db
      .query("contract_attachments")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    return {
      ...contract,
      author: author ? { name: author.name, email: author.email } : null,
      assignedUser: assignedUser
        ? { name: assignedUser.name, email: assignedUser.email }
        : null,
      template: template ? { name: template.name, type: template.type } : null,
      parties,
      attachments,
    };
  },
});

/**
 * Mutation to create a new contract
 * @param {Object} args - Contract data
 * @returns {Promise<string>} Created contract ID
 */
export const createContract = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
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
    authorId: v.id("users"),
    templateId: v.optional(v.id("contract_templates")),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    tags: v.optional(v.array(v.string())),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const contractId = await ctx.db.insert("contracts", {
      ...args,
      version: "1.0",
      status: "draft",
      priority: args.priority || "medium",
      autoRenewal: false,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });

    // Create initial revision
    await ctx.db.insert("contract_revisions", {
      contractId,
      version: "1.0",
      content: args.content,
      summary: "Initial contract creation",
      changes: [],
      authorId: args.authorId,
      createdAt: now,
    });

    return contractId;
  },
});

/**
 * Mutation to update an existing contract
 * @param {Object} args - Contract update data
 * @returns {Promise<string>} Updated contract ID
 */
export const updateContract = mutation({
  args: {
    id: v.id("contracts"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("under_review"),
        v.literal("pending_approval"),
        v.literal("approved"),
        v.literal("active"),
        v.literal("expired"),
        v.literal("terminated"),
        v.literal("archived")
      )
    ),
    assignedTo: v.optional(v.id("users")),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    tags: v.optional(v.array(v.string())),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();

    const existingContract = await ctx.db.get(id);
    if (!existingContract) {
      throw new Error("Contract not found");
    }

    // Update contract
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    return id;
  },
});

/**
 * Mutation to delete a contract
 * @param {Object} args - Delete arguments
 * @param {string} args.id - Contract ID to delete
 * @returns {Promise<void>}
 */
export const deleteContract = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (!contract) {
      throw new Error("Contract not found");
    }

    // Delete related records
    const parties = await ctx.db
      .query("contract_parties")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    const revisions = await ctx.db
      .query("contract_revisions")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    const approvals = await ctx.db
      .query("contract_approvals")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    const attachments = await ctx.db
      .query("contract_attachments")
      .withIndex("by_contract", (q) => q.eq("contractId", args.id))
      .collect();

    // Delete all related records
    await Promise.all([
      ...parties.map((party) => ctx.db.delete(party._id)),
      ...revisions.map((revision) => ctx.db.delete(revision._id)),
      ...approvals.map((approval) => ctx.db.delete(approval._id)),
      ...attachments.map((attachment) => ctx.db.delete(attachment._id)),
    ]);

    // Delete the contract
    await ctx.db.delete(args.id);
  },
});

/**
 * Query to get contract analytics
 * @param {Object} args - Analytics arguments
 * @param {string} args.startDate - Start date for analytics
 * @param {string} args.endDate - End date for analytics
 * @returns {Promise<Object>} Analytics data
 */
export const getContractAnalytics = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate } = args;

    // Get total contracts count
    const totalContracts = await ctx.db.query("contracts").collect();

    // Get active contracts
    const activeContracts = totalContracts.filter(
      (contract) => contract.status === "active"
    );

    // Get pending contracts
    const pendingContracts = totalContracts.filter(
      (contract) =>
        contract.status === "pending_approval" ||
        contract.status === "under_review"
    );

    // Get expiring contracts (next 30 days)
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const expiringContracts = totalContracts.filter(
      (contract) =>
        contract.expirationDate &&
        contract.expirationDate <= thirtyDaysFromNow &&
        contract.status === "active"
    );

    return {
      totalContracts: totalContracts.length,
      activeContracts: activeContracts.length,
      pendingContracts: pendingContracts.length,
      expiringContracts: expiringContracts.length,
      contractsByType: totalContracts.reduce(
        (acc, contract) => {
          acc[contract.type] = (acc[contract.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      contractsByStatus: totalContracts.reduce(
        (acc, contract) => {
          acc[contract.status] = (acc[contract.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  },
});
