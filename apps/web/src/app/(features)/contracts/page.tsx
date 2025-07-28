"use client";
import {
  AnalyticsSection,
  ContractCreationButton,
  ContractsTable,
} from "@/components/feature-pages/contracts";
import { TopNavigation } from "@/components/layout";
import * as React from "react";

/**
 * Main contracts page component
 * Displays analytics, templates, and contract history
 * @returns {JSX.Element} The contracts page layout
 */
export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <>
      <TopNavigation
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="container mx-auto px-4 py-8 space-y-8 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contract Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your contracts, templates, and legal documents
            </p>
          </div>
          <ContractCreationButton />
        </div>

        {/* Analytics Cards */}
        <AnalyticsSection />

        {/* Contracts Table */}
        <ContractsTable />
      </div>
    </>
  );
}
