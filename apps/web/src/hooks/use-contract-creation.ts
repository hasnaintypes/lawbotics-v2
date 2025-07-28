"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContracts } from "./use-contracts";
import { toast } from "sonner";
import type { ContractFormData } from "@/types";
import { useFormattedUser } from "./use-formatted-user";
import { useConvexUserId } from "./use-convex-user-id";

/**
 * Initial form data for contract creation
 */
const initialFormData: ContractFormData = {
  name: "",
  description: "",
  type: "custom",
  priority: "medium",
  currency: "USD",
  startDate: "",
  endDate: "",
  expirationDate: "",
  autoRenewal: false,
  requiresNotarization: false,
  allowsAmendments: true,
  confidential: false,
  tags: [],
  parties: [],
  clauses: [],
};

/**
 * Custom hook for contract creation with Sonner notifications
 * @returns {Object} Contract creation state and handlers
 */
export function useContractCreation() {
  const [formData, setFormData] = useState<ContractFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { createContract } = useContracts();
  const convexUserId = useConvexUserId();

  /**
   * Updates form data with partial updates
   * @param {Partial<ContractFormData>} updates - Form data updates
   */
  const updateFormData = (updates: Partial<ContractFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear any previous errors when user makes changes
    if (error) setError(null);
  };

  /**
   * Validates form data before submission
   * @returns {boolean} Whether form is valid
   */
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Contract name is required");
      toast.error("Validation Error", {
        description: "Please enter a contract name.",
      });
      return false;
    }

    if (formData.parties.length === 0) {
      setError("At least one party is required");
      toast.error("Validation Error", {
        description: "Please add at least one party to the contract.",
      });
      return false;
    }

    if (formData.clauses.length === 0) {
      setError("At least one clause is required");
      toast.error("Validation Error", {
        description: "Please add at least one clause to the contract.",
      });
      return false;
    }

    // Validate party information
    const invalidParty = formData.parties.find(
      (party) => !party.name.trim() || !party.role.trim()
    );
    if (invalidParty) {
      setError("All parties must have a name and role");
      toast.error("Validation Error", {
        description:
          "Please ensure all parties have both name and role filled out.",
      });
      return false;
    }

    // Validate clause information
    const invalidClause = formData.clauses.find(
      (clause) => !clause.title.trim() || !clause.content.trim()
    );
    if (invalidClause) {
      setError("All clauses must have a title and content");
      toast.error("Validation Error", {
        description: "Please ensure all clauses have both title and content.",
      });
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Saves contract as draft or final with comprehensive error handling
   * @param {boolean} isDraft - Whether to save as draft
   * @returns {Promise<string|null>} Contract ID if successful
   */
  const saveContract = async (isDraft = false): Promise<string | null> => {
    if (!validateForm()) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    // Show loading toast
    const loadingToast = toast.loading(
      isDraft ? "Saving Draft..." : "Creating Contract...",
      {
        description: isDraft
          ? "Saving your contract as a draft."
          : "Creating your new contract.",
      }
    );

    try {
      // Prepare contract data for Convex
      const contractData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        type: formData.type,
        priority: formData.priority,
        content: generateContractContent(formData),
        value: formData.value,
        currency: formData.currency,
        startDate: formData.startDate
          ? new Date(formData.startDate).getTime()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).getTime()
          : undefined,
        expirationDate: formData.expirationDate
          ? new Date(formData.expirationDate).getTime()
          : undefined,
        autoRenewal: formData.autoRenewal,
        renewalPeriod: formData.renewalPeriod,
        notificationPeriod: formData.notificationPeriod,
        governingLaw: formData.governingLaw,
        jurisdiction: formData.jurisdiction,
        requiresNotarization: formData.requiresNotarization,
        allowsAmendments: formData.allowsAmendments,
        confidential: formData.confidential,
        tags: formData.tags,
        authorId: convexUserId,
        parties: formData.parties,
        clauses: formData.clauses,
      };

      const contractId = await createContract(contractData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (contractId) {
        // Success notification
        toast.success(
          isDraft
            ? "Draft Saved Successfully"
            : "Contract Created Successfully",
          {
            description: isDraft
              ? `"${formData.name}" has been saved as a draft.`
              : `"${formData.name}" has been created and is ready for review.`,
            duration: 4000,
          }
        );

        // Navigate to contract view page
        router.push(`/contracts/${contractId}`);
        return contractId;
      } else {
        throw new Error("Failed to create contract");
      }
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      const errorMessage =
        err instanceof Error ? err.message : "Failed to save contract";
      setError(errorMessage);

      toast.error(
        isDraft ? "Failed to Save Draft" : "Failed to Create Contract",
        {
          description: errorMessage,
          duration: 5000,
        }
      );

      setIsLoading(false);
      return null;
    }

    setIsLoading(false);
    return null;
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    toast.info("Form Reset", {
      description: "All form data has been cleared.",
      duration: 2000,
    });
  };

  return {
    formData,
    updateFormData,
    saveContract,
    resetForm,
    isLoading,
    error,
  };
}

/**
 * Generates contract content from form data
 * @param {ContractFormData} formData - Form data
 * @returns {string} Generated contract content
 */
function generateContractContent(formData: ContractFormData): string {
  let content = `<h1>${formData.name}</h1>\n\n`;

  if (formData.description) {
    content += `<p><strong>Description:</strong> ${formData.description}</p>\n\n`;
  }

  // Add contract information
  content += `<h2>Contract Information</h2>\n`;
  content += `<ul>\n`;
  content += `<li><strong>Type:</strong> ${formData.type.replace("_", " ").toUpperCase()}</li>\n`;
  content += `<li><strong>Priority:</strong> ${formData.priority.toUpperCase()}</li>\n`;
  if (formData.value) {
    content += `<li><strong>Value:</strong> ${formData.currency} ${formData.value.toLocaleString()}</li>\n`;
  }
  if (formData.startDate) {
    content += `<li><strong>Start Date:</strong> ${formData.startDate}</li>\n`;
  }
  if (formData.endDate) {
    content += `<li><strong>End Date:</strong> ${formData.endDate}</li>\n`;
  }
  content += `</ul>\n\n`;

  // Add parties
  if (formData.parties.length > 0) {
    content += `<h2>Contract Parties</h2>\n`;
    formData.parties.forEach((party, index) => {
      content += `<h3>${index + 1}. ${party.name}</h3>\n`;
      content += `<ul>\n`;
      content += `<li><strong>Type:</strong> ${party.type.replace("_", " ").toUpperCase()}</li>\n`;
      content += `<li><strong>Role:</strong> ${party.role}</li>\n`;
      if (party.email)
        content += `<li><strong>Email:</strong> ${party.email}</li>\n`;
      if (party.phone)
        content += `<li><strong>Phone:</strong> ${party.phone}</li>\n`;
      if (party.address)
        content += `<li><strong>Address:</strong> ${party.address}</li>\n`;
      content += `</ul>\n\n`;
    });
  }

  // Add clauses
  if (formData.clauses.length > 0) {
    content += `<h2>Contract Terms and Conditions</h2>\n`;
    formData.clauses
      .sort((a, b) => a.order - b.order)
      .forEach((clause, index) => {
        content += `<h3>${index + 1}. ${clause.title}</h3>\n`;
        content += `${clause.content}\n\n`;
      });
  }

  return content;
}
