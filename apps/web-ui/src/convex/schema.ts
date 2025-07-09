import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), 
    name: v.string(),
    email: v.string(), // Unique constraint can be enforced in logic
    avatar: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }).index("by_email", ["email"]), // Optional index for uniqueness check

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    ownerId: v.id("users"), // Changed to reference the Convex user ID
    fileType: v.string(),
    fileSize: v.number(),
    fileUrl: v.string(),
    vectorEmbedding: v.optional(v.array(v.number())),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"]),

    analyses: defineTable({
      documentId: v.id("documents"),
      status: v.union(v.literal("pending"), v.literal("processing"), v.literal("complete"), v.literal("failed")),
      partyPerspective: v.optional(v.string()),
      analysisDepth: v.union(v.literal("summary"), v.literal("full")),
      analysisBias: v.union(v.literal("neutral"), v.literal("favorable"), v.literal("risk")),
      document: v.object({
        id: v.string(),
        title: v.string(),
        type: v.string(),
        status: v.string(),
        parties: v.array(v.string()),
        effectiveDate: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
        value: v.optional(v.string()),
      }),
      riskScore: v.optional(v.number()),
      keyClauses: v.optional(
        v.array(
          v.object({
            title: v.string(),
            section: v.string(),
            text: v.string(),
            importance: v.string(),
            analysis: v.string(),
            recommendation: v.optional(v.string()),
          }),
        ),
      ),
      negotiableTerms: v.optional(
        v.array(
          v.object({
            title: v.string(),
            description: v.string(),
            priority: v.string(),
            currentLanguage: v.string(),
            suggestedLanguage: v.string(),
            rationale: v.optional(v.string()),
          }),
        ),
      ),
      redFlags: v.optional(
        v.array(
          v.object({
            title: v.string(),
            description: v.string(),
            severity: v.string(),
            location: v.optional(v.string()),
          }),
        ),
      ),
      recommendations: v.optional(
        v.array(
          v.object({
            title: v.string(),
            description: v.string(),
          }),
        ),
      ),
      overallImpression: v.optional(
        v.object({
          summary: v.string(),
          pros: v.array(v.string()),
          cons: v.array(v.string()),
          conclusion: v.string(),
        }),
      ),
      createdAt: v.number(),
    }).index("by_document", ["documentId"]),
  
    extractedParties: defineTable({
      documentId: v.id("documents"),
      parties: v.array(v.string()),
      createdAt: v.number(),
    }).index("by_document", ["documentId"]),

});
