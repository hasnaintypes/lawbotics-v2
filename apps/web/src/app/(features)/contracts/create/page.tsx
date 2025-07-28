"use client";
import { Suspense } from "react";
import { ContractCreationForm } from "@/components/feature-pages/contracts";

/**
 * Contract creation page component
 * Displays the form for creating new custom contracts
 * @returns {JSX.Element} Contract creation page
 */
export default function CreateContractPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Contract Creation Form */}
        <Suspense>
          <ContractCreationForm />
        </Suspense>
      </div>
    </div>
  );
}
