"use client";

import { ContractsTableHeader } from "./contracts-table-header";
import { ContractsTableRow } from "./contracts-table-row";
import { ContractsTablePagination } from "./contracts-table-pagination";
import { useContracts } from "@/hooks";
import { ContractActionsDropdown } from "./contract-actions-dropdown";
import { formatDate, getStatusVariant, getStatusText } from "@/lib";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

/**
 * Main contracts table component with Convex integration
 * @returns {JSX.Element} Complete contracts table with header, rows, and pagination
 */
export function ContractsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { contracts, total, isLoading } = useContracts({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  /**
   * Handles page navigation
   * @param {number} page - Page number
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Handles next page navigation
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Handles previous page navigation
   */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <ContractsTableSkeleton />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Contract History
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          View and manage all your contracts ({total} total)
        </p>
      </div>

      <div className="border rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <ContractsTableHeader />
            <tbody className="divide-y divide-border">
              {contracts.map((contract, index) => (
                <ContractsTableRow
                  key={contract._id}
                  contract={contract}
                  sequenceNumber={(currentPage - 1) * itemsPerPage + index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden divide-y divide-border">
          {contracts.map((contract, index) => (
            <ContractMobileCard
              key={contract._id}
              contract={contract}
              sequenceNumber={(currentPage - 1) * itemsPerPage + index + 1}
            />
          ))}
        </div>

        {/* Empty State */}
        {contracts.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No contracts found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ContractsTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
        />
      )}
    </section>
  );
}

/**
 * Mobile card component for contract display
 * @param {Object} props - Component props
 * @returns {JSX.Element} Mobile contract card
 */
function ContractMobileCard({
  contract,
  sequenceNumber,
}: {
  contract: any;
  sequenceNumber: number;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">
              #{sequenceNumber}
            </span>
            <Badge
              variant={getStatusVariant(contract.status)}
              className="text-xs rounded-full"
            >
              {getStatusText(contract.status)}
            </Badge>
          </div>
          <h3 className="font-medium text-sm truncate">{contract.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {contract.type?.replace("_", " ")} • v{contract.version} •{" "}
            {contract.author?.name || "Unknown"}
          </p>
        </div>
        <ContractActionsDropdown contract={contract} />
      </div>
      <div className="text-xs text-muted-foreground">
        Created: {formatDate(new Date(contract.createdAt).toISOString())}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for contracts table
 * @returns {JSX.Element} Skeleton component
 */
function ContractsTableSkeleton() {
  return (
    <section className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <div className="hidden lg:block">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
