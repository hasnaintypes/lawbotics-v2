import type { ClauseTemplate } from "@/types/contract-form"

/**
 * Contract type options
 */
export const CONTRACT_TYPES = [
  { value: "nda", label: "Non-Disclosure Agreement" },
  { value: "service_agreement", label: "Service Agreement" },
  { value: "employment", label: "Employment Contract" },
  { value: "lease", label: "Lease Agreement" },
  { value: "purchase", label: "Purchase Agreement" },
  { value: "partnership", label: "Partnership Agreement" },
  { value: "licensing", label: "Licensing Agreement" },
  { value: "consulting", label: "Consulting Agreement" },
  { value: "vendor", label: "Vendor Agreement" },
  { value: "custom", label: "Custom Contract" },
]

/**
 * Contract priority options
 */
export const CONTRACT_PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
]

/**
 * Party type options
 */
export const PARTY_TYPES = [
  { value: "client", label: "Client" },
  { value: "vendor", label: "Vendor" },
  { value: "partner", label: "Partner" },
  { value: "employee", label: "Employee" },
  { value: "contractor", label: "Contractor" },
  { value: "other", label: "Other" },
]

/**
 * Predefined clause templates
 */
export const CLAUSE_TEMPLATES: ClauseTemplate[] = [
  {
    id: "scope-of-work",
    title: "Scope of Work",
    description: "Define the work to be performed",
    content: `<p>The scope of work under this agreement includes:</p>
<ul>
<li>Detailed description of services to be provided</li>
<li>Deliverables and milestones</li>
<li>Timeline and deadlines</li>
<li>Performance standards and quality requirements</li>
</ul>
<p>Any work outside this scope will require a separate agreement or amendment.</p>`,
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    description: "Define payment schedule and terms",
    content: `<p>Payment terms for this agreement:</p>
<ul>
<li>Total contract value: [Amount]</li>
<li>Payment schedule: [Schedule details]</li>
<li>Payment method: [Method]</li>
<li>Late payment penalties: [Penalty terms]</li>
</ul>
<p>All payments are due within 30 days of invoice date unless otherwise specified.</p>`,
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    description: "Protect confidential information",
    content: `<p>Both parties acknowledge that they may have access to confidential information during the course of this agreement.</p>
<p>Confidential information includes:</p>
<ul>
<li>Trade secrets and proprietary information</li>
<li>Business strategies and plans</li>
<li>Customer and supplier information</li>
<li>Financial information</li>
</ul>
<p>Both parties agree to maintain strict confidentiality and not disclose such information to third parties.</p>`,
  },
  {
    id: "termination",
    title: "Termination",
    description: "Define termination conditions",
    content: `<p>This agreement may be terminated:</p>
<ul>
<li>By mutual consent of both parties</li>
<li>By either party with [Notice Period] written notice</li>
<li>Immediately for material breach of contract</li>
<li>Upon completion of all obligations</li>
</ul>
<p>Upon termination, all confidential information must be returned and outstanding payments settled.</p>`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    description: "Define liability limitations",
    content: `<p>Limitation of liability provisions:</p>
<ul>
<li>Neither party shall be liable for indirect, incidental, or consequential damages</li>
<li>Total liability shall not exceed the total contract value</li>
<li>Each party shall indemnify the other against third-party claims</li>
<li>Force majeure events shall excuse performance</li>
</ul>
<p>These limitations shall survive termination of this agreement.</p>`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    description: "Define IP ownership and rights",
    content: `<p>Intellectual property provisions:</p>
<ul>
<li>Each party retains ownership of their pre-existing intellectual property</li>
<li>Work product created under this agreement shall be owned by [Party]</li>
<li>License grants and usage rights as specified</li>
<li>Protection of proprietary information and trade secrets</li>
</ul>
<p>Any disputes regarding intellectual property shall be resolved through arbitration.</p>`,
  },
]
