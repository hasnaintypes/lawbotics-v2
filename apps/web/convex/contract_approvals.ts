import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all approvals for a specific contract
 * @param {Object} args - Query arguments
 * @param {string} args.contractId - Contract ID
 * @returns {Promise<Array>} Contract approvals with approver info
 */
export const getContractApprovals = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const approvals = await ctx.db
      .query("contract_approvals")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .collect();

    // Get approver information for each approval
    const approvalsWithApprovers = await Promise.all(
      approvals.map(async (approval) => {
        const approver = await ctx.db.get(approval.approverId);
        return {
          ...approval,
          approver: approver
            ? {
                name: approver.name,
                email: approver.email,
                role: approver.role,
              }
            : null,
        };
      })
    );

    return approvalsWithApprovers;
  },
});

/**
 * Mutation to request contract approval
 * @param {Object} args - Approval request data
 * @returns {Promise<string>} Created approval ID
 */
export const requestContractApproval = mutation({
  args: {
    contractId: v.id("contracts"),
    approverId: v.id("users"),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const approvalId = await ctx.db.insert("contract_approvals", {
      ...args,
      status: "pending",
      createdAt: now,
    });

    // TODO: Send notification to approver

    return approvalId;
  },
});

/**
 * Mutation to approve or reject a contract
 * @param {Object} args - Approval decision data
 * @returns {Promise<string>} Updated approval ID
 */
export const updateContractApproval = mutation({
  args: {
    id: v.id("contract_approvals"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();

    const existingApproval = await ctx.db.get(id);
    if (!existingApproval) {
      throw new Error("Approval not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      completedAt: now,
    });

    // TODO: Update contract status if all approvals are complete
    // TODO: Send notifications

    return id;
  },
});
