"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type ContractAnalyticsData = {
  totalContracts: number;
  prevTotalContracts: number;
  activeContracts: number;
  prevActiveContracts: number;
  pendingContracts: number;
  prevPendingContracts: number;
  expiringContracts: number;
  prevExpiringContracts: number;
  contractsByType: Record<string, number>;
  contractsByStatus: Record<string, number>;
};

/**
 * Custom hook for contract analytics data
 * @param {Object} options - Analytics options
 * @returns {Object} Analytics data
 */
export function useContractAnalytics(
  options: {
    startDate?: string;
    endDate?: string;
  } = {}
) {
  const analyticsData = useQuery(
    api.contracts.getContractAnalytics,
    options
  ) as ContractAnalyticsData | undefined;

  /**
   * Formats analytics data for display
   */

  // Helper to calculate percent change
  const percentChange = (current: number, prev: number) => {
    if (prev === 0) return current === 0 ? "0%" : "+100%";
    const change = ((current - prev) / prev) * 100;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  const formatAnalyticsForDisplay = () => {
    if (!analyticsData) return [];

    return [
      {
        id: "total",
        title: "Total Contracts",
        value: analyticsData.totalContracts,
        change: percentChange(
          analyticsData.totalContracts,
          analyticsData.prevTotalContracts
        ),
        icon: "FileText",
        trend:
          analyticsData.totalContracts > analyticsData.prevTotalContracts
            ? "up"
            : analyticsData.totalContracts < analyticsData.prevTotalContracts
              ? "down"
              : "neutral",
      },
      {
        id: "active",
        title: "Active Contracts",
        value: analyticsData.activeContracts,
        change: percentChange(
          analyticsData.activeContracts,
          analyticsData.prevActiveContracts
        ),
        icon: "CheckCircle",
        trend:
          analyticsData.activeContracts > analyticsData.prevActiveContracts
            ? "up"
            : analyticsData.activeContracts < analyticsData.prevActiveContracts
              ? "down"
              : "neutral",
      },
      {
        id: "pending",
        title: "Pending Review",
        value: analyticsData.pendingContracts,
        change: percentChange(
          analyticsData.pendingContracts,
          analyticsData.prevPendingContracts
        ),
        icon: "Clock",
        trend:
          analyticsData.pendingContracts > analyticsData.prevPendingContracts
            ? "up"
            : analyticsData.pendingContracts <
                analyticsData.prevPendingContracts
              ? "down"
              : "neutral",
      },
      {
        id: "expiring",
        title: "Expiring Soon",
        value: analyticsData.expiringContracts,
        change: percentChange(
          analyticsData.expiringContracts,
          analyticsData.prevExpiringContracts
        ),
        icon: "AlertTriangle",
        trend:
          analyticsData.expiringContracts > analyticsData.prevExpiringContracts
            ? "up"
            : analyticsData.expiringContracts <
                analyticsData.prevExpiringContracts
              ? "down"
              : "neutral",
      },
    ];
  };

  return {
    analytics: formatAnalyticsForDisplay(),
    rawData: analyticsData,
    contractsByType: analyticsData?.contractsByType || {},
    contractsByStatus: analyticsData?.contractsByStatus || {},
    isLoading: analyticsData === undefined,
  };
}
