"use client";

import { useContract } from "@/hooks/use-contracts";
import { useParams } from "next/navigation";
import { ContractPreview } from "@/components/feature-pages/contracts/preview/contract-preview";
import { Id } from "../../../../../convex/_generated/dataModel";
import type { ContractFormData } from "@/types";
import { LoadingSpinner } from "@/components/shared";
import { FileText, ArrowLeft } from "lucide-react";
/**
 * Page component to view a specific contract by ID
 * Fetches contract data and displays it using ContractPreview
 * @returns {JSX.Element} Contract preview page
 */

export default function ContractViewPage() {
  const params = useParams();
  const contractId = params?.id as Id<"contracts">;
  const { contract, isLoading, error } = useContract(contractId);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner
          title="Loading Contract"
          description="Fetching contract details..."
          size="lg"
        />
      </div>
    );

  if (error || !contract)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-6">
          <FileText className="h-20 w-20 text-red-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              Contract Not Found
            </h2>
            <p className="text-slate-600 max-w-md">
              The contract you're looking for doesn't exist, has been removed,
              or you do not have access.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/contracts")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contracts
          </button>
        </div>
      </div>
    );

  return (
    <ContractPreview
      formData={contract as unknown as ContractFormData} // Ensure contract matches ContractFormData type
    />
  );
}
