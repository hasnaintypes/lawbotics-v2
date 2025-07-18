/**
 * Contract status enumeration
 */
export type ContractStatus =
  | "draft"
  | "active"
  | "expired"
  | "pending"
  | "terminated";

/**
 * Contract type enumeration
 */
export type ContractType =
  | "nda"
  | "service_agreement"
  | "employment"
  | "lease"
  | "purchase"
  | "partnership"
  | "licensing"
  | "consulting"
  | "vendor"
  | "custom";

/**
 * Contract interface definition
 */
export interface Contract {
  /** Unique contract identifier */
  id: string;
  /** Contract name/title */
  name: string;
  /** Type of contract */
  type: ContractType;
  /** Contract version */
  version: string;
  /** Contract author */
  author: string;
  /** Current contract status */
  status: ContractStatus;
  /** Creation date */
  createdAt: string;
  /** Last updated date */
  updatedAt: string;
  /** Contract expiration date */
  expiresAt?: string;
  /** Contract description */
  description?: string;
  /** Associated template ID */
  templateId?: string;
}

/**
 * Contract template interface definition
 */
export interface ContractTemplate {
  /** Unique template identifier */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template category */
  category: string;
  /** Template type */
  type: ContractType;
  /** Lucide icon component */
  icon: any;
  /** Number of times template has been used */
  usageCount: number;
  /** Template content */
  content?: string;
  /** Template fields */
  fields?: TemplateField[];
  /** Pre-defined clauses for this template */
  preDefinedClauses?: PreDefinedClause[];
}

/**
 * Template field interface definition
 */
export interface TemplateField {
  /** Field identifier */
  id: string;
  /** Field name */
  name: string;
  /** Field type */
  type: "text" | "number" | "date" | "select" | "textarea";
  /** Whether field is required */
  required: boolean;
  /** Field placeholder text */
  placeholder?: string;
  /** Select options (for select type) */
  options?: string[];
}

/**
 * Pre-defined clause interface
 */
export interface PreDefinedClause {
  /** Clause identifier */
  id: string;
  /** Clause title */
  title: string;
  /** Clause content (HTML) */
  content: string;
  /** Clause order */
  order: number;
}

/**
 * Analytics data interface definition
 */
export interface AnalyticsData {
  /** Unique identifier */
  id: string;
  /** Metric title */
  title: string;
  /** Metric value */
  value: string | number;
  /** Percentage change */
  change: string;
  /** Lucide icon name */
  icon: string;
  /** Trend direction */
  trend: "up" | "down" | "neutral";
}
