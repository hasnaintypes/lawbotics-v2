import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all parties for a specific contract
 * @param {Object} args - Query arguments
 * @param {string} args.contractId - Contract ID
 * @returns {Promise<Array>} Contract parties
 */
export const getContractParties = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contract_parties")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .collect();
  },
});

/**
 * Mutation to add a party to a contract
 * @param {Object} args - Party data
 * @returns {Promise<string>} Created party ID
 */
export const addContractParty = mutation({
  args: {
    contractId: v.id("contracts"),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const partyId = await ctx.db.insert("contract_parties", {
      ...args,
      hasSigned: false,
      createdAt: now,
    });

    return partyId;
  },
});

/**
 * Mutation to update a contract party
 * @param {Object} args - Party update data
 * @returns {Promise<string>} Updated party ID
 */
export const updateContractParty = mutation({
  args: {
    id: v.id("contract_parties"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    role: v.optional(v.string()),
    hasSigned: v.optional(v.boolean()),
    signedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existingParty = await ctx.db.get(id);
    if (!existingParty) {
      throw new Error("Party not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

/**
 * Mutation to remove a party from a contract
 * @param {Object} args - Party ID
 * @returns {Promise<void>}
 */
export const removeContractParty = mutation({
  args: { id: v.id("contract_parties") },
  handler: async (ctx, args) => {
    const party = await ctx.db.get(args.id);
    if (!party) {
      throw new Error("Party not found");
    }

    await ctx.db.delete(args.id);
  },
});
