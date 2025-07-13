import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex database schema definition for the legal AI application
 *
 * This schema defines the structure for:
 * - User management and authentication
 * - Document storage and processing
 * - Legal document analysis results
 * - Extracted party information
 *
 * All tables include appropriate indexes for efficient querying
 */
export default defineSchema({
  /**
   * Users table - stores user profile information synced from Clerk authentication
   *
   * @field userId - Clerk user ID for authentication integration
   * @field name - User's display name
   * @field email - User's email address (indexed for uniqueness checks)
   * @field avatar - URL to user's profile picture
   * @field role - User role (admin or user) for authorization
   */
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    avatar: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }).index("by_email", ["email"]),

  /**
   * Documents table - stores uploaded legal documents and their metadata
   *
   * @field title - Document title/filename
   * @field content - Extracted text content from the document
   * @field ownerId - Reference to the user who owns this document
   * @field fileType - MIME type of the original file
   * @field fileSize - Size of the file in bytes
   * @field fileUrl - URL to the stored file in Convex storage
   * @field vectorEmbedding - Optional vector embedding for semantic search
   * @field status - Processing status (processing, completed, failed)
   * @field createdAt - Timestamp when document was created
   * @field updatedAt - Timestamp when document was last modified
   */
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    ownerId: v.id("users"),
    fileType: v.string(),
    fileSize: v.number(),
    fileUrl: v.string(),
    vectorEmbedding: v.optional(v.array(v.number())),
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"]),

  /**
   * Analyses table - stores AI-generated legal document analysis results
   * Enhanced schema for flexible analysis types and scalable content structure
   *
   * @field documentId - Reference to the analyzed document
   * @field status - Analysis processing status
   * @field analysisType - Type of analysis (full, summary, risk-focused, etc.)
   * @field partyPerspective - Optional party perspective for biased analysis
   * @field analysisDepth - Depth of analysis (summary or full)
   * @field analysisBias - Bias type (neutral, favorable, or risk-focused)
   * @field document - Extracted document metadata from analysis
   * @field riskScore - Optional risk score (0-100)
   * @field quickSummary - Brief overview for summary-type analyses
   * @field keyClauses - Optional array of important clauses with analysis
   * @field negotiableTerms - Optional array of terms that can be negotiated
   * @field redFlags - Optional array of potential issues or concerns
   * @field recommendations - Optional array of actionable recommendations
   * @field overallImpression - Optional summary with pros, cons, and conclusion
   * @field metadata - Optional metadata for analysis configuration and processing info
   * @field createdAt - Timestamp when analysis was created
   * @field updatedAt - Timestamp when analysis was last modified
   */
  analyses: defineTable({
    documentId: v.id("documents"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("complete"),
      v.literal("failed")
    ),
    partyPerspective: v.optional(v.string()),
    analysisBias: v.union(
      v.literal("neutral"),
      v.literal("favorable"),
      v.literal("risk")
    ),
    document: v.optional(
      v.object({
        id: v.string(),
        title: v.string(),
        type: v.string(),
        status: v.string(),
        parties: v.array(v.string()),
        effectiveDate: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
        value: v.optional(v.string()),
      })
    ),
    riskScore: v.optional(v.number()),
    keyClauses: v.optional(
      v.array(
        v.object({
          title: v.string(),
          section: v.optional(v.string()),
          text: v.optional(v.string()),
          importance: v.optional(v.string()),
          analysis: v.string(),
          recommendation: v.optional(v.string()),
        })
      )
    ),
    negotiableTerms: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          priority: v.optional(v.string()),
          currentLanguage: v.optional(v.string()),
          suggestedLanguage: v.optional(v.string()),
          rationale: v.optional(v.string()),
        })
      )
    ),
    redFlags: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          severity: v.optional(v.string()),
          location: v.optional(v.string()),
          impact: v.optional(v.string()),
          mitigation: v.optional(v.string()),
        })
      )
    ),
    recommendations: v.optional(
      v.array(
        v.object({
          title: v.string(),
          description: v.string(),
          priority: v.optional(v.string()),
          category: v.optional(v.string()),
        })
      )
    ),
    overallImpression: v.optional(
      v.object({
        summary: v.string(),
        pros: v.optional(v.array(v.string())),
        cons: v.optional(v.array(v.string())),
        conclusion: v.string(),
      })
    ),
    metadata: v.optional(
      v.object({
        processingTime: v.optional(v.number()),
        promptVersion: v.optional(v.string()),
        aiModel: v.optional(v.string()),
        retries: v.optional(v.number()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_document", ["documentId"])
    .index("by_status", ["status"]),

  /**
   * Extracted Parties table - stores party information extracted from documents
   *
   * @field documentId - Reference to the document these parties were extracted from
   * @field parties - Array of party names found in the document
   * @field createdAt - Timestamp when parties were extracted
   */
  extractedParties: defineTable({
    documentId: v.id("documents"),
    parties: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),

  /**
   * Contracts table - stores user-generated contracts with comprehensive management features
   *
   * @field userId - Clerk user ID for authentication integration
   * @field templateSlug - Reference to the template used (if any)
   * @field title - Contract title/name
   * @field description - Optional contract description
   * @field formData - Form data used to populate the contract
   * @field enabledClauses - Which clauses are enabled in this contract
   * @field generatedContent - Final generated contract content in Markdown format
   * @field status - Current contract status (draft, review, active, completed, cancelled)
   * @field version - Version number for this contract instance
   * @field parentContractId - Reference to parent contract for versioning (optional)
   * @field pdfFileId - Reference to stored PDF file in Convex storage (optional)
   * @field metadata - Additional contract metadata (parties, dates, etc.)
   * @field createdAt - Timestamp when contract was created
   * @field updatedAt - Timestamp when contract was last modified
   */
  /**
   * Contract Templates table - stores contract templates created by admins
   * These templates define the structure and fields for different contract types
   *
   * @field slug - Unique identifier for the template (URL-friendly)
   * @field title - Template display name
   * @field description - Template description for users
   * @field category - Template category (nda, employment, lease, etc.)
   * @field isActive - Whether the template is available for use
   * @field formFields - Array of form field definitions for data collection
   * @field clauses - Array of contract clause definitions
   * @field content - Template content with placeholders for variable substitution
   * @field metadata - Additional template configuration
   * @field createdBy - Admin user who created this template
   * @field createdAt - Timestamp when template was created
   * @field updatedAt - Timestamp when template was last modified
   */
  contractTemplates: defineTable({
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
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_creator", ["createdBy"]),

  contracts: defineTable({
    userId: v.string(),
    templateId: v.optional(v.id("contractTemplates")),
    templateSlug: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    formData: v.any(), // Allow flexible form data structure for custom contracts
    enabledClauses: v.any(), // Allow flexible clause selection for custom contracts
    generatedContent: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    version: v.number(),
    parentContractId: v.optional(v.id("contracts")),
    pdfFileId: v.optional(v.id("_storage")),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_template_id", ["templateId"])
    .index("by_template", ["templateSlug"])
    .index("by_status", ["status"])
    .index("by_parent", ["parentContractId"])
    .index("by_version", ["userId", "parentContractId", "version"]),
});
