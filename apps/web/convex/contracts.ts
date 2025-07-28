import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all contracts with pagination and filtering
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
        const assignedUser = contract.assignedTo
          ? await ctx.db.get(contract.assignedTo)
          : null;

        return {
          ...contract,
          author: author ? { name: author.name, email: author.email } : null,
          assignedUser: assignedUser
            ? { name: assignedUser.name, email: assignedUser.email }
            : null,
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
 */
export const getContract = query({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (!contract) return null;

    // Get author information
    const author = await ctx.db.get(contract.authorId);
    const assignedUser = contract.assignedTo
      ? await ctx.db.get(contract.assignedTo)
      : null;

    return {
      ...contract,
      author: author ? { name: author.name, email: author.email } : null,
      assignedUser: assignedUser
        ? { name: assignedUser.name, email: assignedUser.email }
        : null,
    };
  },
});

/**
 * Mutation to create a new contract
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
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    expirationDate: v.optional(v.number()),
    autoRenewal: v.optional(v.boolean()),
    renewalPeriod: v.optional(v.number()),
    notificationPeriod: v.optional(v.number()),
    governingLaw: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    requiresNotarization: v.optional(v.boolean()),
    allowsAmendments: v.optional(v.boolean()),
    confidential: v.optional(v.boolean()),
    parties: v.array(
      v.object({
        id: v.string(),
        type: v.union(
          v.literal("client"),
          v.literal("vendor"),
          v.literal("partner"),
          v.literal("employee"),
          v.literal("contractor"),
          v.literal("other")
        ),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        role: v.string(),
      })
    ),
    clauses: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        content: v.string(),
        order: v.number(),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate that parties and clauses are not empty
    if (!args.parties || args.parties.length === 0) {
      throw new Error("At least one party is required to create a contract.");
    }
    if (!args.clauses || args.clauses.length === 0) {
      throw new Error("At least one clause is required to create a contract.");
    }

    const contractId = await ctx.db.insert("contracts", {
      ...args,
      version: 1,
      status: "draft",
      priority: args.priority || "medium",
      autoRenewal: args.autoRenewal || false,
      requiresNotarization: args.requiresNotarization || false,
      allowsAmendments: args.allowsAmendments || true,
      confidential: args.confidential || false,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });

    return contractId;
  },
});

/**
 * Mutation to create a new version (edit) of a contract
 * Increments version, sets parentContractId, and copies all fields
 */

export const editContract = mutation({
  args: {
    id: v.id("contracts"),
    // All editable fields (same as createContract except authorId is optional)
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
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    expirationDate: v.optional(v.number()),
    autoRenewal: v.optional(v.boolean()),
    renewalPeriod: v.optional(v.number()),
    notificationPeriod: v.optional(v.number()),
    governingLaw: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    requiresNotarization: v.optional(v.boolean()),
    allowsAmendments: v.optional(v.boolean()),
    confidential: v.optional(v.boolean()),
    parties: v.array(
      v.object({
        id: v.string(),
        type: v.union(
          v.literal("client"),
          v.literal("vendor"),
          v.literal("partner"),
          v.literal("employee"),
          v.literal("contractor"),
          v.literal("other")
        ),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        role: v.string(),
      })
    ),
    clauses: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        content: v.string(),
        order: v.number(),
      })
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Contract not found");

    // Remove 'id' from args before inserting
    const { id, ...rest } = args;
    // Increment version, set parentContractId
    const newVersion = (existing.version || 1) + 1;
    const contractId = await ctx.db.insert("contracts", {
      ...rest,
      authorId: existing.authorId,
      version: newVersion,
      parentContractId: id,
      status: "draft",
      priority: args.priority || "medium",
      autoRenewal: args.autoRenewal || false,
      requiresNotarization: args.requiresNotarization || false,
      allowsAmendments: args.allowsAmendments || true,
      confidential: args.confidential || false,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });
    return contractId;
  },
});

/**
 * Mutation to update an existing contract
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
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    expirationDate: v.optional(v.number()),
    autoRenewal: v.optional(v.boolean()),
    renewalPeriod: v.optional(v.number()),
    notificationPeriod: v.optional(v.number()),
    governingLaw: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    requiresNotarization: v.optional(v.boolean()),
    allowsAmendments: v.optional(v.boolean()),
    confidential: v.optional(v.boolean()),
    parties: v.optional(
      v.array(
        v.object({
          id: v.string(),
          type: v.union(
            v.literal("client"),
            v.literal("vendor"),
            v.literal("partner"),
            v.literal("employee"),
            v.literal("contractor"),
            v.literal("other")
          ),
          name: v.string(),
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
          address: v.optional(v.string()),
          role: v.string(),
        })
      )
    ),
    clauses: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          content: v.string(),
          order: v.number(),
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // NOTE: If updating parties or clauses, the client must send the full updated array, as this will overwrite the existing array in the contract.
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
 */
export const deleteContract = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (!contract) {
      throw new Error("Contract not found");
    }

    await ctx.db.delete(args.id);
  },
});

/**
 * Query to get contract analytics
 */
export const getContractAnalytics = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    authorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let contractsQuery = ctx.db.query("contracts");
    if (args.authorId) {
      contractsQuery = contractsQuery.filter((q) =>
        q.eq(q.field("authorId"), args.authorId)
      );
    }
    const totalContracts = await contractsQuery.collect();

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
