"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  const analyticsData = useQuery(api.contracts.getContractAnalytics, options);

  /**
   * Formats analytics data for display
   */
  const formatAnalyticsForDisplay = () => {
    if (!analyticsData) return [];

    return [
      {
        id: "total",
        title: "Total Contracts",
        value: analyticsData.totalContracts,
        change: "+12.5%", // TODO: Calculate actual change
        icon: "FileText",
        trend: "up" as const,
      },
      {
        id: "active",
        title: "Active Contracts",
        value: analyticsData.activeContracts,
        change: "+8.2%", // TODO: Calculate actual change
        icon: "CheckCircle",
        trend: "up" as const,
      },
      {
        id: "pending",
        title: "Pending Review",
        value: analyticsData.pendingContracts,
        change: "-4.1%", // TODO: Calculate actual change
        icon: "Clock",
        trend: "down" as const,
      },
      {
        id: "expiring",
        title: "Expiring Soon",
        value: analyticsData.expiringContracts,
        change: "+2.3%", // TODO: Calculate actual change
        icon: "AlertTriangle",
        trend: "neutral" as const,
      },
    ];
  };

  return {
    analytics: formatAnalyticsForDisplay(),
    rawData: analyticsData,
    isLoading: analyticsData === undefined,
  };
}
