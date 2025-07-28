/**
 * Contract form data interface
 */
export interface ContractFormData {
  /** Contract name */
  name: string
  /** Contract description */
  description: string
  /** Contract type */
  type:
    | "nda"
    | "service_agreement"
    | "employment"
    | "lease"
    | "purchase"
    | "partnership"
    | "licensing"
    | "consulting"
    | "vendor"
    | "custom"
  /** Contract priority */
  priority: "low" | "medium" | "high" | "urgent"
  /** Contract value */
  value?: number
  /** Contract currency */
  currency: string
  /** Contract start date */
  startDate: string
  /** Contract end date */
  endDate: string
  /** Contract expiration date */
  expirationDate: string
  /** Auto renewal flag */
  autoRenewal: boolean
  /** Renewal period in days */
  renewalPeriod?: number
  /** Notification period before expiration */
  notificationPeriod?: number
  /** Governing law */
  governingLaw?: string
  /** Jurisdiction */
  jurisdiction?: string
  /** Requires notarization */
  requiresNotarization: boolean
  /** Allows amendments */
  allowsAmendments: boolean
  /** Confidential flag */
  confidential: boolean
  /** Contract tags */
  tags: string[]
  /** Contract parties */
  parties: ContractParty[]
  /** Contract clauses */
  clauses: ContractClause[]
}

/**
 * Contract party interface
 */
export interface ContractParty {
  /** Party ID */
  id: string
  /** Party type */
  type: "client" | "vendor" | "partner" | "employee" | "contractor" | "other"
  /** Party name */
  name: string
  /** Party email */
  email: string
  /** Party phone */
  phone: string
  /** Party address */
  address: string
  /** Party role in contract */
  role: string
}

/**
 * Contract clause interface
 */
export interface ContractClause {
  /** Clause ID */
  id: string
  /** Clause title */
  title: string
  /** Clause content (HTML) */
  content: string
  /** Clause order */
  order: number
}

/**
 * Clause template interface
 */
export interface ClauseTemplate {
  /** Template ID */
  id: string
  /** Template title */
  title: string
  /** Template description */
  description: string
  /** Template content */
  content: string
}
