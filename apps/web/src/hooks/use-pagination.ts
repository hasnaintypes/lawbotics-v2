import { useMemo } from "react";

/**
 * Pagination configuration options
 */
interface PaginationConfig {
  /** Current active page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Maximum number of visible page buttons (default: 5) */
  maxVisiblePages?: number;
}

/**
 * Pagination result containing calculated values
 */
interface PaginationResult {
  /** Array of page numbers to display, including ellipsis indicators */
  visiblePages: (number | "ellipsis")[];
  /** Whether to show the previous button */
  showPrevious: boolean;
  /** Whether to show the next button */
  showNext: boolean;
  /** Whether the previous button should be disabled */
  isPreviousDisabled: boolean;
  /** Whether the next button should be disabled */
  isNextDisabled: boolean;
}

/**
 * Pagination data for items display
 */
interface PaginationData<T> {
  /** Items for the current page */
  currentItems: T[];
  /** Total number of items */
  totalItems: number;
  /** Starting index of current page items (0-based) */
  startIndex: number;
  /** Ending index of current page items (exclusive) */
  endIndex: number;
}

/**
 * Complete pagination hook result
 */
interface UsePaginationReturn<T> {
  /** Pagination navigation data */
  pagination: PaginationResult;
  /** Current page data */
  data: PaginationData<T>;
}

/**
 * Custom hook for handling pagination logic
 *
 * Provides comprehensive pagination functionality including:
 * - Page calculation and visibility logic
 * - Item slicing for current page
 * - Navigation state management
 * - Smart ellipsis placement for large page counts
 *
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items to show per page
 * @param config - Pagination configuration
 * @returns Pagination state and current page data
 *
 * @example
 * ```tsx
 * const [currentPage, setCurrentPage] = useState(1)
 * const { pagination, data } = usePagination(documents, 10, {
 *   currentPage,
 *   totalPages: Math.ceil(documents.length / 10)
 * })
 *
 * // Render current page items
 * {data.currentItems.map(item => <ItemComponent key={item.id} {...item} />)}
 *
 * // Render pagination controls
 * {pagination.visiblePages.map((page, index) => (
 *   page === "ellipsis" ? <Ellipsis key={index} /> : <PageButton key={page} page={page} />
 * ))}
 * ```
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  config: PaginationConfig
): UsePaginationReturn<T> {
  const { currentPage, totalPages, maxVisiblePages = 5 } = config;

  const pagination = useMemo<PaginationResult>(() => {
    const visiblePages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is within max visible range
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Complex logic for large page counts
      visiblePages.push(1); // Always show first page

      if (currentPage > 3) {
        visiblePages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          visiblePages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        visiblePages.push("ellipsis");
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        visiblePages.push(totalPages);
      }
    }

    return {
      visiblePages,
      showPrevious: totalPages > 1,
      showNext: totalPages > 1,
      isPreviousDisabled: currentPage <= 1,
      isNextDisabled: currentPage >= totalPages,
    };
  }, [currentPage, totalPages, maxVisiblePages]);

  const data = useMemo<PaginationData<T>>(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      currentItems,
      totalItems: items.length,
      startIndex,
      endIndex,
    };
  }, [items, currentPage, itemsPerPage]);

  return {
    pagination,
    data,
  };
}

/**
 * Utility function to calculate total pages from item count and page size
 *
 * @param totalItems - Total number of items
 * @param itemsPerPage - Items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(
  totalItems: number,
  itemsPerPage: number
): number {
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Utility function to get page range description
 *
 * @param currentPage - Current page number
 * @param itemsPerPage - Items per page
 * @param totalItems - Total number of items
 * @returns Range description (e.g., "1-10 of 25")
 */
export function getPageRangeText(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): string {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  return `${startIndex}-${endIndex} of ${totalItems}`;
}
