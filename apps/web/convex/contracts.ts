import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Contract management functionality for the legal AI platform
 *
 * This module provides comprehensive contract CRUD operations including:
 * - Contract creation and management
 * - Version control and history tracking
 * - Template-based contract generation
 * - Content storage and retrieval
 * - Status management and workflow support
 */

/**
 * Query: Get all contracts for the current user with pagination support
 * @param limit - Maximum number of contracts to return (optional)
 * @param offset - Number of contracts to skip for pagination (optional)
 * @param status - Filter by contract status (optional)
 * @returns Array of user's contracts with metadata
 */
export const getUserContracts = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let contracts = await ctx.db
      .query("contracts")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();

    // Filter by status if provided
    if (args.status) {
      contracts = contracts.filter(
        (contract) => contract.status === args.status
      );
    }

    // Apply pagination if limit is provided
    if (args.limit) {
      const startIndex = args.offset || 0;
      contracts = contracts.slice(startIndex, startIndex + args.limit);
    }

    // Get contract counts by status
    const allContracts = await ctx.db
      .query("contracts")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const statusCounts = {
      draft: allContracts.filter((c) => c.status === "draft").length,
      review: allContracts.filter((c) => c.status === "review").length,
      active: allContracts.filter((c) => c.status === "active").length,
      completed: allContracts.filter((c) => c.status === "completed").length,
      cancelled: allContracts.filter((c) => c.status === "cancelled").length,
    };

    return {
      contracts,
      statusCounts,
      totalCount: allContracts.length,
    };
  },
});

/**
 * Query: Get a specific contract by ID with version history
 * @param contractId - The ID of the contract to retrieve
 * @returns Contract document with version history or null if not found
 */
export const getContract = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const contract = await ctx.db.get(args.contractId);

    if (!contract || contract.userId !== identity.subject) {
      return null;
    }

    // Get version history
    const versions = await ctx.db
      .query("contracts")
      .withIndex("by_parent", (q) => q.eq("parentContractId", args.contractId))
      .order("desc")
      .collect();

    // Get parent contract versions if this is a version
    let allVersions = [contract];
    if (contract.parentContractId) {
      const parentVersions = await ctx.db
        .query("contracts")
        .withIndex("by_parent", (q) =>
          q.eq("parentContractId", contract.parentContractId)
        )
        .order("desc")
        .collect();
      const parent = await ctx.db.get(contract.parentContractId);
      if (parent) {
        allVersions = [parent, ...parentVersions];
      }
    } else {
      allVersions = [contract, ...versions];
    }

    return {
      contract,
      versions: allVersions.sort((a, b) => b.version - a.version),
    };
  },
});

/**
 * Query: Get contracts by template slug
 * @param templateSlug - The slug of the template
 * @returns Array of contracts using this template
 */
export const getContractsByTemplate = query({
  args: { templateSlug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("contracts")
      .withIndex("by_template", (q) => q.eq("templateSlug", args.templateSlug))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});

/**
 * Mutation: Create a new contract with comprehensive metadata
 * @param templateSlug - The template used for this contract (optional)
 * @param title - The title of the contract
 * @param description - Optional contract description
 * @param formData - Form data used to populate the contract
 * @param enabledClauses - Which clauses are enabled in this contract
 * @param generatedContent - Generated contract content in Markdown
 * @param status - Current status of the contract (defaults to draft)
 * @param metadata - Additional contract metadata
 * @returns The created contract with full details
 */
export const createContract = mutation({
  args: {
    templateSlug: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    formData: v.object({}),
    enabledClauses: v.object({}),
    generatedContent: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    metadata: v.optional(
      v.object({
        parties: v.optional(
          v.array(
            v.object({
              name: v.string(),
              role: v.string(),
              email: v.optional(v.string()),
            })
          )
        ),
        effectiveDate: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
        governingLaw: v.optional(v.string()),
        totalValue: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const contractData = {
      userId: identity.subject,
      templateSlug: args.templateSlug,
      title: args.title,
      description: args.description,
      formData: args.formData,
      enabledClauses: args.enabledClauses,
      generatedContent: args.generatedContent,
      status: args.status || "draft",
      version: 1.0,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    };

    const contractId = await ctx.db.insert("contracts", contractData);
    const contract = await ctx.db.get(contractId);

    return {
      success: true,
      contractId,
      contract,
      message: "Contract created successfully",
    };
  },
});

/**
 * Mutation: Update an existing contract with change tracking
 * @param contractId - The ID of the contract to update
 * @param updates - Fields to update
 * @param createNewVersion - Whether to create a new version (default: false)
 * @returns The updated contract or new version details
 */
export const updateContract = mutation({
  args: {
    contractId: v.id("contracts"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    formData: v.optional(v.object({})),
    enabledClauses: v.optional(v.object({})),
    generatedContent: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    metadata: v.optional(
      v.object({
        parties: v.optional(
          v.array(
            v.object({
              name: v.string(),
              role: v.string(),
              email: v.optional(v.string()),
            })
          )
        ),
        effectiveDate: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
        governingLaw: v.optional(v.string()),
        totalValue: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      })
    ),
    createNewVersion: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const contract = await ctx.db.get(args.contractId);
    if (!contract || contract.userId !== identity.subject) {
      throw new Error("Contract not found or unauthorized");
    }

    const { contractId, createNewVersion, ...updates } = args;
    const now = Date.now();

    if (createNewVersion) {
      // Create a new version
      const parentId = contract.parentContractId || contractId;
      const newVersion = contract.version + 0.1;

      const newVersionData = {
        ...contract,
        ...updates,
        version: newVersion,
        parentContractId: parentId,
        createdAt: now,
        updatedAt: now,
      };

      delete (newVersionData as any)._id;
      delete (newVersionData as any)._creationTime;

      const newContractId = await ctx.db.insert("contracts", newVersionData);
      const newContract = await ctx.db.get(newContractId);

      return {
        success: true,
        contractId: newContractId,
        contract: newContract,
        isNewVersion: true,
        version: newVersion,
        message: `New version ${newVersion} created successfully`,
      };
    } else {
      // Update existing contract
      await ctx.db.patch(contractId, {
        ...updates,
        updatedAt: now,
      });

      const updatedContract = await ctx.db.get(contractId);

      return {
        success: true,
        contractId,
        contract: updatedContract,
        isNewVersion: false,
        message: "Contract updated successfully",
      };
    }
  },
});

/**
 * Mutation: Delete a contract and its versions
 * @param contractId - The ID of the contract to delete
 * @param deleteAllVersions - Whether to delete all versions (default: false)
 * @returns Success confirmation
 */
export const deleteContract = mutation({
  args: {
    contractId: v.id("contracts"),
    deleteAllVersions: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const contract = await ctx.db.get(args.contractId);
    if (!contract || contract.userId !== identity.subject) {
      throw new Error("Contract not found or unauthorized");
    }

    if (args.deleteAllVersions) {
      // Delete all versions
      const parentId = contract.parentContractId || args.contractId;
      const versions = await ctx.db
        .query("contracts")
        .withIndex("by_parent", (q) => q.eq("parentContractId", parentId))
        .collect();

      // Delete all versions
      for (const version of versions) {
        await ctx.db.delete(version._id);
      }

      // Delete parent if this isn't the parent
      if (contract.parentContractId) {
        await ctx.db.delete(contract.parentContractId);
      }
    }

    await ctx.db.delete(args.contractId);

    return {
      success: true,
      message: args.deleteAllVersions
        ? "Contract and all versions deleted successfully"
        : "Contract deleted successfully",
    };
  },
});

/**
 * Mutation: Duplicate a contract as a new draft
 * @param contractId - The ID of the contract to duplicate
 * @param newTitle - Title for the duplicated contract
 * @returns The new contract details
 */
export const duplicateContract = mutation({
  args: {
    contractId: v.id("contracts"),
    newTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const originalContract = await ctx.db.get(args.contractId);
    if (!originalContract || originalContract.userId !== identity.subject) {
      throw new Error("Contract not found or unauthorized");
    }

    const now = Date.now();
    const duplicatedContract = {
      userId: identity.subject,
      templateSlug: originalContract.templateSlug,
      title: args.newTitle,
      description: originalContract.description,
      formData: originalContract.formData,
      enabledClauses: originalContract.enabledClauses,
      generatedContent: originalContract.generatedContent,
      status: "draft" as const,
      version: 1.0,
      metadata: originalContract.metadata,
      createdAt: now,
      updatedAt: now,
    };

    const newContractId = await ctx.db.insert("contracts", duplicatedContract);
    const newContract = await ctx.db.get(newContractId);

    return {
      success: true,
      contractId: newContractId,
      contract: newContract,
      message: "Contract duplicated successfully",
    };
  },
});

/**
 * Mutation: Update contract status with validation
 * @param contractId - The ID of the contract to update
 * @param status - New status for the contract
 * @returns Updated contract details
 */
export const updateContractStatus = mutation({
  args: {
    contractId: v.id("contracts"),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const contract = await ctx.db.get(args.contractId);
    if (!contract || contract.userId !== identity.subject) {
      throw new Error("Contract not found or unauthorized");
    }

    await ctx.db.patch(args.contractId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    const updatedContract = await ctx.db.get(args.contractId);

    return {
      success: true,
      contract: updatedContract,
      message: `Contract status updated to ${args.status}`,
    };
  },
});

/**
 * Mutation: Store PDF file reference for a contract
 * @param contractId - The ID of the contract
 * @param pdfFileId - The Convex storage file ID for the PDF
 * @returns Success confirmation
 */
export const updateContractPdf = mutation({
  args: {
    contractId: v.id("contracts"),
    pdfFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const contract = await ctx.db.get(args.contractId);
    if (!contract || contract.userId !== identity.subject) {
      throw new Error("Contract not found or unauthorized");
    }

    await ctx.db.patch(args.contractId, {
      pdfFileId: args.pdfFileId,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "PDF reference updated successfully",
    };
  },
});
