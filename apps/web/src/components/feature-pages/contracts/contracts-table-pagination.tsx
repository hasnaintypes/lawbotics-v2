"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

interface ContractsTablePaginationProps {
  /** Current page number */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Page change handler */
  onPageChange: (page: number) => void
  /** Next page handler */
  onNext: () => void
  /** Previous page handler */
  onPrevious: () => void
}

/**
 * Pagination component for contracts table
 * @param {ContractsTablePaginationProps} props - Pagination properties
 * @returns {JSX.Element} Pagination controls
 */
export function ContractsTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
}: ContractsTablePaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="gap-3">
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
            onClick={currentPage === 1 ? undefined : onPrevious}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1 ? true : undefined}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
            onClick={currentPage === totalPages ? undefined : onNext}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages ? true : undefined}
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
