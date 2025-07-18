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
   * Contracts table - stores contract documents and metadata
   *
   */
  contracts: defineTable({
    /** Contract title/name */
    name: v.string(),
    /** Contract description */
    description: v.optional(v.string()),
    /** Contract type/category */
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
    /** Current contract status */
    status: v.union(
      v.literal("draft"),
      v.literal("under_review"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("active"),
      v.literal("expired"),
      v.literal("terminated"),
      v.literal("archived")
    ),
    /** Contract version number */
    version: v.string(),
    /** Contract priority level */
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    /** Contract content/body */
    content: v.string(),
    /** Contract value/amount */
    value: v.optional(v.number()),
    /** Contract currency */
    currency: v.optional(v.string()),
    /** Contract start date */
    startDate: v.optional(v.number()),
    /** Contract end date */
    endDate: v.optional(v.number()),
    /** Contract expiration date */
    expirationDate: v.optional(v.number()),
    /** Auto-renewal flag */
    autoRenewal: v.boolean(),
    /** Renewal period in days */
    renewalPeriod: v.optional(v.number()),
    /** Contract author user ID */
    authorId: v.id("users"),
    /** Assigned lawyer/manager user ID */
    assignedTo: v.optional(v.id("users")),
    /** Template used to create contract */
    templateId: v.optional(v.id("contract_templates")),
    /** Parent contract ID (for amendments/versions) */
    parentContractId: v.optional(v.id("contracts")),
    /** Contract tags for categorization */
    tags: v.array(v.string()),
    /** Contract creation timestamp */
    createdAt: v.number(),
    /** Last contract update timestamp */
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_assigned", ["assignedTo"])
    .index("by_template", ["templateId"])
    .index("by_expiration", ["expirationDate"])
    .index("by_created", ["createdAt"]),

  /**
   * Contract templates table - stores reusable contract templates
   */
  contract_templates: defineTable({
    /** Template name */
    name: v.string(),
    /** Template description */
    description: v.string(),
    /** Template category */
    category: v.string(),
    /** Template type */
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
    /** Template content/body */
    content: v.string(),
    /** Template variables/placeholders */
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
    /** Template usage count */
    usageCount: v.number(),
    /** Whether template is active */
    isActive: v.boolean(),
    /** Template author user ID */
    authorId: v.id("users"),
    /** Template creation timestamp */
    createdAt: v.number(),
    /** Last template update timestamp */
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_type", ["type"])
    .index("by_author", ["authorId"])
    .index("by_usage", ["usageCount"]),

  /**
   * Contract parties table - stores parties involved in contracts
   */
  contract_parties: defineTable({
    /** Associated contract ID */
    contractId: v.id("contracts"),
    /** Party type */
    type: v.union(
      v.literal("client"),
      v.literal("vendor"),
      v.literal("partner"),
      v.literal("employee"),
      v.literal("contractor"),
      v.literal("other")
    ),
    /** Party name (individual or organization) */
    name: v.string(),
    /** Party email */
    email: v.optional(v.string()),
    /** Party phone */
    phone: v.optional(v.string()),
    /** Party address */
    address: v.optional(v.string()),
    /** Party role in contract */
    role: v.string(),
    /** Whether party has signed */
    hasSigned: v.boolean(),
    /** Signature date */
    signedAt: v.optional(v.number()),
    /** Party creation timestamp */
    createdAt: v.number(),
  })
    .index("by_contract", ["contractId"])
    .index("by_type", ["type"]),

  /**
   * Contract revisions table - tracks contract version history
   */
  contract_revisions: defineTable({
    /** Associated contract ID */
    contractId: v.id("contracts"),
    /** Revision version */
    version: v.string(),
    /** Revision content */
    content: v.string(),
    /** Revision summary/notes */
    summary: v.string(),
    /** Changes made in this revision */
    changes: v.array(
      v.object({
        field: v.string(),
        oldValue: v.optional(v.string()),
        newValue: v.string(),
        description: v.optional(v.string()),
      })
    ),
    /** Revision author user ID */
    authorId: v.id("users"),
    /** Revision creation timestamp */
    createdAt: v.number(),
  })
    .index("by_contract", ["contractId"])
    .index("by_author", ["authorId"])
    .index("by_version", ["contractId", "version"]),

  /**
   * Contract approvals table - tracks approval workflow
   */
  contract_approvals: defineTable({
    /** Associated contract ID */
    contractId: v.id("contracts"),
    /** Approver user ID */
    approverId: v.id("users"),
    /** Approval status */
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    /** Approval comments */
    comments: v.optional(v.string()),
    /** Approval due date */
    dueDate: v.optional(v.number()),
    /** Approval completion timestamp */
    completedAt: v.optional(v.number()),
    /** Approval request timestamp */
    createdAt: v.number(),
  })
    .index("by_contract", ["contractId"])
    .index("by_approver", ["approverId"])
    .index("by_status", ["status"]),

  /**
   * Contract attachments table - stores contract-related files
   */
  contract_attachments: defineTable({
    /** Associated contract ID */
    contractId: v.id("contracts"),
    /** File name */
    fileName: v.string(),
    /** File type/extension */
    fileType: v.string(),
    /** File size in bytes */
    fileSize: v.number(),
    /** File storage URL */
    fileUrl: v.string(),
    /** Attachment description */
    description: v.optional(v.string()),
    /** Uploader user ID */
    uploadedBy: v.id("users"),
    /** Upload timestamp */
    createdAt: v.number(),
  })
    .index("by_contract", ["contractId"])
    .index("by_uploader", ["uploadedBy"]),

  /**
   * Contract notifications table - stores system notifications
   */
  contract_notifications: defineTable({
    /** Associated contract ID */
    contractId: v.optional(v.id("contracts")),
    /** Recipient user ID */
    userId: v.id("users"),
    /** Notification type */
    type: v.union(
      v.literal("contract_created"),
      v.literal("contract_updated"),
      v.literal("approval_required"),
      v.literal("contract_approved"),
      v.literal("contract_rejected"),
      v.literal("contract_expiring"),
      v.literal("contract_expired"),
      v.literal("signature_required"),
      v.literal("contract_signed")
    ),
    /** Notification title */
    title: v.string(),
    /** Notification message */
    message: v.string(),
    /** Whether notification has been read */
    isRead: v.boolean(),
    /** Notification creation timestamp */
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_contract", ["contractId"])
    .index("by_type", ["type"])
    .index("by_read_status", ["userId", "isRead"]),

  /**
   * Contract analytics table - stores analytics and metrics
   */
  contract_analytics: defineTable({
    /** Analytics date (YYYY-MM-DD) */
    date: v.string(),
    /** Metric type */
    metric: v.union(
      v.literal("contracts_created"),
      v.literal("contracts_signed"),
      v.literal("contracts_expired"),
      v.literal("approval_time_avg"),
      v.literal("contract_value_total"),
      v.literal("template_usage")
    ),
    /** Metric value */
    value: v.number(),
    /** Additional metadata */
    metadata: v.optional(
      v.object({
        contractType: v.optional(v.string()),
        department: v.optional(v.string()),
        templateId: v.optional(v.id("contract_templates")),
      })
    ),
    /** Analytics record timestamp */
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_metric", ["metric"])
    .index("by_date_metric", ["date", "metric"]),

  /**
   * Clause library table - stores reusable clause templates for contracts
   */
  clause_library: defineTable({
    /** Clause title */
    title: v.string(),
    /** Clause description */
    description: v.string(),
    /** Clause content (HTML) */
    content: v.string(),
    /** Clause category */
    category: v.string(),
    /** Clause tags for categorization */
    tags: v.array(v.string()),
    /** Clause usage count */
    usageCount: v.number(),
    /** Whether clause is active */
    isActive: v.boolean(),
    /** Clause author user ID */
    authorId: v.id("users"),
    /** Clause creation timestamp */
    createdAt: v.number(),
    /** Last clause update timestamp */
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .index("by_usage", ["usageCount"])
    .index("by_active", ["isActive"]),
});
