"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Custom hook for managing contract templates
 * @param {Object} options - Query options
 * @returns {Object} Templates data and operations
 */
export function useContractTemplates(
  options: {
    limit?: number;
    offset?: number;
    category?: string;
    type?: string;
  } = {}
) {
  const templatesData = useQuery(api.contract_templates.getTemplates, options);

  // Mutations
  const createTemplate = useMutation(api.contract_templates.createTemplate);
  const updateTemplate = useMutation(api.contract_templates.updateTemplate);
  const deleteTemplate = useMutation(api.contract_templates.deleteTemplate);
  const incrementUsage = useMutation(
    api.contract_templates.incrementTemplateUsage
  );

  /**
   * Creates a new template
   * @param {Object} templateData - Template data
   * @returns {Promise<Id<"contract_templates"> | null>} Created template ID
   */
  const handleCreateTemplate = async (
    templateData: any
  ): Promise<Id<"contract_templates"> | null> => {
    try {
      const templateId = await createTemplate(templateData);
      return templateId;
    } catch (error) {
      console.error("Failed to create template:", error);
      return null;
    }
  };

  /**
   * Updates an existing template
   * @param {Id<"contract_templates">} templateId - Template ID
   * @param {Object} updates - Template updates
   * @returns {Promise<boolean>} Success status
   */
  const handleUpdateTemplate = async (
    templateId: Id<"contract_templates">,
    updates: any
  ): Promise<boolean> => {
    try {
      await updateTemplate({ id: templateId, ...updates });
      return true;
    } catch (error) {
      console.error("Failed to update template:", error);
      return false;
    }
  };

  /**
   * Increments template usage count
   * @param {Id<"contract_templates">} templateId - Template ID
   * @returns {Promise<boolean>} Success status
   */
  const handleIncrementUsage = async (
    templateId: Id<"contract_templates">
  ): Promise<boolean> => {
    try {
      await incrementUsage({ id: templateId });
      return true;
    } catch (error) {
      console.error("Failed to increment template usage:", error);
      return false;
    }
  };

  return {
    // Data
    templates: templatesData?.templates || [],
    total: templatesData?.total || 0,
    hasMore: templatesData?.hasMore || false,
    isLoading: templatesData === undefined,

    // Operations
    createTemplate: handleCreateTemplate,
    updateTemplate: handleUpdateTemplate,
    deleteTemplate: async (id: Id<"contract_templates">) => {
      try {
        await deleteTemplate({ id });
        return true;
      } catch (error) {
        console.error("Failed to delete template:", error);
        return false;
      }
    },
    incrementUsage: handleIncrementUsage,
  };
}

/**
 * Custom hook for getting a single template
 * @param {Id<"contract_templates">} templateId - Template ID
 * @returns {Object} Template data
 */
export function useContractTemplate(templateId: Id<"contract_templates">) {
  const template = useQuery(api.contract_templates.getTemplate, { id: templateId });

  return {
    template,
    isLoading: template === undefined,
    error: template === null ? "Template not found" : null,
  };
}
