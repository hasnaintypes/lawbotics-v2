import type { ContractTemplate } from "@/types/contracts"
import { Shield, Briefcase, UserCheck } from "lucide-react"

/**
 * Contract templates with pre-defined clauses and content
 */
export const CONTRACT_TEMPLATES_DATA: ContractTemplate[] = [
  {
    id: "nda-template",
    name: "Non-Disclosure Agreement",
    description: "Standard NDA template for protecting confidential information between parties.",
    category: "Legal",
    type: "nda",
    icon: Shield,
    usageCount: 45,
    content: `<h2>NON-DISCLOSURE AGREEMENT</h2>
<p>This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] by and between [PARTY_1] and [PARTY_2].</p>
<p>The parties agree to the following terms and conditions:</p>`,
    fields: [
      {
        id: "party_1",
        name: "First Party",
        type: "text",
        required: true,
        placeholder: "Company or Individual Name",
      },
      {
        id: "party_2",
        name: "Second Party",
        type: "text",
        required: true,
        placeholder: "Company or Individual Name",
      },
      {
        id: "effective_date",
        name: "Effective Date",
        type: "date",
        required: true,
        placeholder: "Agreement start date",
      },
      {
        id: "duration",
        name: "Duration",
        type: "select",
        required: true,
        options: ["1 year", "2 years", "3 years", "5 years", "Indefinite"],
      },
    ],
    preDefinedClauses: [
      {
        id: "confidentiality-definition",
        title: "Definition of Confidential Information",
        content: `<p>For purposes of this Agreement, "Confidential Information" includes:</p>
<ul>
<li>Trade secrets, proprietary information, and know-how</li>
<li>Technical data, research, product plans, and software</li>
<li>Customer lists, supplier information, and business strategies</li>
<li>Financial information and pricing data</li>
<li>Any other information marked as confidential</li>
</ul>`,
        order: 1,
      },
      {
        id: "non-disclosure-obligation",
        title: "Non-Disclosure Obligation",
        content: `<p>The receiving party agrees to:</p>
<ul>
<li>Hold all Confidential Information in strict confidence</li>
<li>Not disclose any Confidential Information to third parties</li>
<li>Use Confidential Information solely for the intended purpose</li>
<li>Take reasonable precautions to protect the confidentiality</li>
</ul>`,
        order: 2,
      },
      {
        id: "return-of-information",
        title: "Return of Information",
        content: `<p>Upon termination of this Agreement or upon request, the receiving party shall:</p>
<ul>
<li>Return all documents containing Confidential Information</li>
<li>Delete all electronic copies and derivatives</li>
<li>Certify in writing the completion of such return or destruction</li>
</ul>`,
        order: 3,
      },
    ],
  },
  {
    id: "service-agreement-template",
    name: "Service Agreement",
    description: "Comprehensive service agreement template for client engagements.",
    category: "Business",
    type: "service_agreement",
    icon: Briefcase,
    usageCount: 32,
    content: `<h2>SERVICE AGREEMENT</h2>
<p>This Service Agreement ("Agreement") is entered into on [DATE] between [SERVICE_PROVIDER] and [CLIENT].</p>
<p>The parties agree to the following terms for the provision of services:</p>`,
    fields: [
      {
        id: "service_provider",
        name: "Service Provider",
        type: "text",
        required: true,
        placeholder: "Company or Individual providing services",
      },
      {
        id: "client",
        name: "Client",
        type: "text",
        required: true,
        placeholder: "Client company or individual",
      },
      {
        id: "service_start_date",
        name: "Service Start Date",
        type: "date",
        required: true,
        placeholder: "When services begin",
      },
      {
        id: "contract_value",
        name: "Contract Value",
        type: "number",
        required: true,
        placeholder: "Total contract amount",
      },
    ],
    preDefinedClauses: [
      {
        id: "scope-of-services",
        title: "Scope of Services",
        content: `<p>The Service Provider agrees to provide the following services:</p>
<ul>
<li>Detailed description of services to be performed</li>
<li>Deliverables and milestones</li>
<li>Performance standards and quality requirements</li>
<li>Timeline and project phases</li>
</ul>
<p>Any additional services outside this scope require written approval and may incur additional charges.</p>`,
        order: 1,
      },
      {
        id: "payment-terms",
        title: "Payment Terms",
        content: `<p>Payment terms and conditions:</p>
<ul>
<li>Total contract value: [CONTRACT_VALUE]</li>
<li>Payment schedule: [PAYMENT_SCHEDULE]</li>
<li>Invoice terms: Net 30 days</li>
<li>Late payment fee: 1.5% per month</li>
<li>Accepted payment methods: [PAYMENT_METHODS]</li>
</ul>`,
        order: 2,
      },
      {
        id: "intellectual-property",
        title: "Intellectual Property Rights",
        content: `<p>Intellectual property provisions:</p>
<ul>
<li>Client retains ownership of pre-existing materials</li>
<li>Work product created under this agreement belongs to Client</li>
<li>Service Provider grants perpetual license to use deliverables</li>
<li>Service Provider retains rights to general methodologies and know-how</li>
</ul>`,
        order: 3,
      },
      {
        id: "termination-clause",
        title: "Termination",
        content: `<p>This agreement may be terminated:</p>
<ul>
<li>By either party with 30 days written notice</li>
<li>Immediately for material breach after 15-day cure period</li>
<li>By mutual agreement of both parties</li>
<li>Upon completion of all services and payment obligations</li>
</ul>
<p>Upon termination, all outstanding invoices become immediately due.</p>`,
        order: 4,
      },
    ],
  },
  {
    id: "employment-contract-template",
    name: "Employment Contract",
    description: "Standard employment contract template with customizable terms.",
    category: "HR",
    type: "employment",
    icon: UserCheck,
    usageCount: 28,
    content: `<h2>EMPLOYMENT AGREEMENT</h2>
<p>This Employment Agreement ("Agreement") is entered into between [COMPANY] and [EMPLOYEE] effective [START_DATE].</p>
<p>The terms and conditions of employment are as follows:</p>`,
    fields: [
      {
        id: "company",
        name: "Company Name",
        type: "text",
        required: true,
        placeholder: "Employer company name",
      },
      {
        id: "employee",
        name: "Employee Name",
        type: "text",
        required: true,
        placeholder: "Full name of employee",
      },
      {
        id: "position",
        name: "Job Title",
        type: "text",
        required: true,
        placeholder: "Employee's job title",
      },
      {
        id: "salary",
        name: "Annual Salary",
        type: "number",
        required: true,
        placeholder: "Annual compensation amount",
      },
      {
        id: "start_date",
        name: "Start Date",
        type: "date",
        required: true,
        placeholder: "Employment start date",
      },
    ],
    preDefinedClauses: [
      {
        id: "position-duties",
        title: "Position and Duties",
        content: `<p>Employee is hired for the position of [POSITION] and agrees to:</p>
<ul>
<li>Perform duties and responsibilities as assigned</li>
<li>Report to [SUPERVISOR] or designated manager</li>
<li>Work [HOURS] hours per week during regular business hours</li>
<li>Maintain professional standards and company policies</li>
<li>Participate in training and development programs as required</li>
</ul>`,
        order: 1,
      },
      {
        id: "compensation-benefits",
        title: "Compensation and Benefits",
        content: `<p>Employee compensation and benefits include:</p>
<ul>
<li>Annual salary: $[SALARY] paid bi-weekly</li>
<li>Health insurance coverage after 90-day waiting period</li>
<li>Paid time off: [PTO_DAYS] days annually</li>
<li>Retirement plan eligibility after one year of service</li>
<li>Performance bonus eligibility based on company metrics</li>
</ul>`,
        order: 2,
      },
      {
        id: "confidentiality-employment",
        title: "Confidentiality and Non-Compete",
        content: `<p>Employee agrees to:</p>
<ul>
<li>Maintain confidentiality of all proprietary company information</li>
<li>Not compete with company business during employment and for 12 months after</li>
<li>Not solicit company employees or customers for 18 months after termination</li>
<li>Return all company property upon termination</li>
</ul>`,
        order: 3,
      },
      {
        id: "termination-employment",
        title: "Termination of Employment",
        content: `<p>Employment may be terminated:</p>
<ul>
<li>By employee with two weeks written notice</li>
<li>By company with or without cause with appropriate notice</li>
<li>Immediately for cause including misconduct or policy violations</li>
<li>Due to company restructuring with severance as per policy</li>
</ul>
<p>Final paycheck will include all earned wages and accrued benefits.</p>`,
        order: 4,
      },
    ],
  },
]

/**
 * Get contract template by ID
 * @param {string} templateId - Template ID
 * @returns {ContractTemplate | undefined} Template data
 */
export function getContractTemplate(templateId: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES_DATA.find((template) => template.id === templateId)
}

/**
 * Get contract template by type
 * @param {string} type - Contract type
 * @returns {ContractTemplate | undefined} Template data
 */
export function getContractTemplateByType(type: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES_DATA.find((template) => template.type === type)
}

/**
 * Get display name for contract type
 * @param {string} type - Contract type
 * @returns {string} Display name
 */
export function getContractTypeDisplayName(type: string): string {
  const template = getContractTemplateByType(type)
  return template?.name || "Custom Contract"
}
