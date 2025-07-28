"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Custom hook for managing contracts with Convex
 * @param {Object} options - Query options
 * @returns {Object} Contracts data and operations
 */
export function useContracts(
  options: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
    authorId?: Id<"users">;
  } = {}
) {
  // Query contracts with pagination and filtering
  const contractsData = useQuery(api.contracts.getContracts, options);

  // Mutations
  const createContract = useMutation(api.contracts.createContract);
  const updateContract = useMutation(api.contracts.updateContract);
  const deleteContract = useMutation(api.contracts.deleteContract);
  const editContract = useMutation(api.contracts.editContract);

  /**
   * Creates a new contract
   * @param {Object} contractData - Contract data
   * @returns {Promise<Id<"contracts"> | null>} Created contract ID
   */
  const handleCreateContract = async (
    contractData: any
  ): Promise<Id<"contracts"> | null> => {
    try {
      const contractId = await createContract(contractData);
      return contractId;
    } catch (error) {
      console.error("Failed to create contract:", error);
      return null;
    }
  };

  /**
   * Updates an existing contract
   * @param {Id<"contracts">} contractId - Contract ID
   * @param {Object} updates - Contract updates
   * @returns {Promise<boolean>} Success status
   */
  const handleUpdateContract = async (
    contractId: Id<"contracts">,
    updates: any
  ): Promise<boolean> => {
    try {
      await updateContract({ id: contractId, ...updates });
      return true;
    } catch (error) {
      console.error("Failed to update contract:", error);
      return false;
    }
  };

  /**
   * Deletes a contract
   * @param {Id<"contracts">} contractId - Contract ID
   * @returns {Promise<boolean>} Success status
   */
  const handleDeleteContract = async (
    contractId: Id<"contracts">
  ): Promise<boolean> => {
    try {
      await deleteContract({ id: contractId });
      return true;
    } catch (error) {
      console.error("Failed to delete contract:", error);
      return false;
    }
  };

  /**
   * Edits (creates a new version of) a contract
   * @param {Object} contractData - Contract data (must include id)
   * @returns {Promise<Id<"contracts"> | null>} New contract version ID
   */
  const handleEditContract = async (
    contractData: any
  ): Promise<Id<"contracts"> | null> => {
    try {
      const newVersionId = await editContract(contractData);
      return newVersionId;
    } catch (error) {
      console.error("Failed to edit contract:", error);
      return null;
    }
  };

  return {
    // Data
    contracts: contractsData?.contracts || [],
    total: contractsData?.total || 0,
    hasMore: contractsData?.hasMore || false,
    isLoading: contractsData === undefined,

    // Operations
    createContract: handleCreateContract,
    updateContract: handleUpdateContract,
    deleteContract: handleDeleteContract,
    editContract: handleEditContract,
  };
}

/**
 * Custom hook for getting a single contract
 * @param {Id<"contracts">} contractId - Contract ID
 * @returns {Object} Contract data and operations
 */
export function useContract(contractId: Id<"contracts">) {
  const contract = useQuery(api.contracts.getContract, { id: contractId });

  return {
    contract,
    isLoading: contract === undefined,
    error: contract === null ? "Contract not found" : null,
  };
}
