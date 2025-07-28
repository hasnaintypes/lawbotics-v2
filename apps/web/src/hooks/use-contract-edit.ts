"use client";

import { useState, useEffect } from "react";
import isEqual from "fast-deep-equal";
import { useContract, useContracts } from "./use-contracts";
import { toast } from "sonner";
import type { ContractFormData } from "@/types/contract-form";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Custom hook for contract editing with version control and Sonner notifications
 * @param {Id<"contracts">} contractId - Contract ID to edit
 * @returns {Object} Contract edit state and handlers
 */
export function useContractEdit(contractId: Id<"contracts">) {
  const { editContract } = useContracts();
  const [formData, setFormData] = useState<
    (ContractFormData & { nextVersion: number }) | null
  >(null);
  const [originalData, setOriginalData] = useState<ContractFormData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    contract,
    isLoading: contractLoading,
    error: contractError,
  } = useContract(contractId);

  useEffect(() => {
    if (contractLoading) return;

    if (contractError || !contract) {
      setError(contractError || "Contract not found");
      setIsLoading(false);
      return;
    }

    loadContractData(contract);
  }, [contract, contractLoading, contractError]);

  /**
   * Loads contract data for editing
   * @param {any} contractData - Contract data from Convex
   */
  const loadContractData = async (contractData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const convertedFormData: ContractFormData = {
        name: contractData.name || "",
        description: contractData.description || "",
        type: contractData.type || "custom",
        priority: contractData.priority || "medium",
        currency: contractData.currency || "USD",
        value: contractData.value,
        startDate: contractData.startDate
          ? new Date(contractData.startDate).toISOString().split("T")[0]
          : "",
        endDate: contractData.endDate
          ? new Date(contractData.endDate).toISOString().split("T")[0]
          : "",
        expirationDate: contractData.expirationDate
          ? new Date(contractData.expirationDate).toISOString().split("T")[0]
          : "",
        autoRenewal: contractData.autoRenewal || false,
        requiresNotarization: contractData.requiresNotarization || false,
        allowsAmendments: contractData.allowsAmendments || true,
        confidential: contractData.confidential || false,
        tags: contractData.tags || [],
        parties: contractData.parties || [],
        clauses:
          Array.isArray(contractData.clauses) && contractData.clauses.length > 0
            ? contractData.clauses
            : parseContractClauses(contractData.content || ""),
      };

      setOriginalData(convertedFormData);
      setFormData({
        ...convertedFormData,
        nextVersion: contractData.version
          ? Number(contractData.version) + 1
          : 2,
      });
      setIsLoading(false);

      toast.success("Contract Loaded", {
        description: `Ready to edit "${contractData.name}" (v${contractData.version}).`,
        duration: 3000,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load contract";
      setError(errorMessage);
      setIsLoading(false);

      toast.error("Loading Failed", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  /**
   * Updates form data with change tracking
   * @param {Partial<ContractFormData>} updates - Form data updates
   */
  const updateFormData = (updates: Partial<ContractFormData>) => {
    if (formData) {
      setFormData((prev) => ({ ...prev!, ...updates }));
      // Clear any previous errors when user makes changes
      if (error) setError(null);
    }
  };

  /**
   * Checks if form has changes compared to original
   */
  // Use lodash.isequal for robust deep equality check
  const hasChanges =
    formData && originalData
      ? !isEqual(formData, {
          ...originalData,
          nextVersion: formData.nextVersion,
        })
      : false;

  /**
   * Validates form data before saving
   * @returns {boolean} Whether form is valid
   */
  const validateForm = (): boolean => {
    if (!formData) return false;

    if (!formData.name.trim()) {
      toast.error("Validation Error", {
        description: "Contract name is required.",
      });
      return false;
    }

    if (formData.parties.length === 0) {
      toast.error("Validation Error", {
        description: "At least one party is required.",
      });
      return false;
    }

    if (formData.clauses.length === 0) {
      toast.error("Validation Error", {
        description: "At least one clause is required.",
      });
      return false;
    }

    return true;
  };

  /**
   * Saves contract with new version and comprehensive error handling
   * @returns {Promise<boolean>} Success status
   */
  const saveContract = async (): Promise<boolean> => {
    if (!formData || !hasChanges || !validateForm()) return false;

    const loadingToast = toast.loading("Creating New Version...", {
      description: `Saving changes as version ${formData.nextVersion}.`,
    });

    try {
      const changes = calculateChanges(originalData!, formData);
      if (changes.length === 0) {
        toast.error("No Changes Detected", {
          description: "Please make changes before saving.",
          duration: 3000,
        });
        toast.dismiss(loadingToast);
        return false;
      }

      // Prepare payload for editContract mutation
      const payload = {
        id: contractId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        content: generateContractContent(formData),
        priority: formData.priority,
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
        parties: formData.parties,
        clauses: formData.clauses,
        tags: formData.tags,
      };

      // Use the efficient editContract function
      const result = await editContract(payload);

      toast.dismiss(loadingToast);
      if (result) {
        toast.success("Contract version saved!", {
          description: `Version ${formData.nextVersion} created successfully.`,
          duration: 3000,
        });
        return true;
      } else {
        throw new Error("Failed to save contract");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save contract";
      setError(errorMessage);
      toast.error("Save Failed", {
        description: errorMessage,
        duration: 5000,
      });
      return false;
    }
  };

  return {
    formData,
    isLoading,
    error,
    updateFormData,
    saveContract,
    hasChanges,
  };
}

/**
 * Parses contract content to extract clauses
 * @param {string} content - Contract content HTML
 * @returns {Array} Parsed clauses
 */
function parseContractClauses(content: string): any[] {
  // This is a simplified parser - in a real app you'd want more sophisticated parsing
  const clauses: any[] = [];
  const sections = content.split("<h3>");

  sections.forEach((section, index) => {
    if (index === 0) return; // Skip first section (usually header)

    const titleMatch = section.match(/^([^<]+)/);
    const contentMatch = section.match(/<\/h3>\s*([\s\S]*?)(?=<h3>|$)/);

    if (titleMatch && contentMatch) {
      clauses.push({
        id: `clause_${index}`,
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        order: index,
      });
    }
  });

  return clauses;
}

/**
 * Calculates changes between original and updated form data
 * @param {ContractFormData} original - Original form data
 * @param {ContractFormData} updated - Updated form data
 * @returns {Array} Array of changes
 */
function calculateChanges(
  original: ContractFormData,
  updated: ContractFormData
): any[] {
  const changes: any[] = [];

  // Check all relevant fields, including those missed before
  const fieldsToCheck = [
    "name",
    "description",
    "type",
    "priority",
    "currency",
    "value",
    "startDate",
    "endDate",
    "expirationDate",
    "autoRenewal",
    "renewalPeriod",
    "notificationPeriod",
    "governingLaw",
    "jurisdiction",
    "requiresNotarization",
    "allowsAmendments",
    "confidential",
    "tags",
  ];
  fieldsToCheck.forEach((field) => {
    if (
      !isEqual(
        original[field as keyof ContractFormData],
        updated[field as keyof ContractFormData]
      )
    ) {
      changes.push({
        field,
        oldValue: String(original[field as keyof ContractFormData] ?? ""),
        newValue: String(updated[field as keyof ContractFormData] ?? ""),
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated`,
      });
    }
  });

  // Check parties changes
  if (!isEqual(original.parties, updated.parties)) {
    changes.push({
      field: "parties",
      oldValue: `${original.parties.length} parties`,
      newValue: `${updated.parties.length} parties`,
      description: "Contract parties updated",
    });
  }

  // Check clauses changes
  if (!isEqual(original.clauses, updated.clauses)) {
    changes.push({
      field: "clauses",
      oldValue: `${original.clauses.length} clauses`,
      newValue: `${updated.clauses.length} clauses`,
      description: "Contract clauses updated",
    });
  }

  return changes;
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
