import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

/**
 * Minimum data requirements for each chart type
 */
export const CHART_MIN_DATA_REQUIREMENTS = {
  weekly_activity: 3,
  risk_distribution: 1,
  document_volume: 2,
  monthly_analysis: 3,
} as const;

/**
 * Type definitions for chart data
 */
export interface WeeklyActivityData {
  day: string;
  uploads: number;
  reviews: number;
}

export interface RiskDistributionData {
  name: string;
  value: number;
  count: number;
}

export interface DocumentVolumeData {
  month: string;
  documents: number;
}

export interface MonthlyAnalysisData {
  month: string;
  contracts: number;
  agreements: number;
  ndas: number;
  licenses: number;
  others: number;
}

export interface ChartData {
  weeklyActivity: WeeklyActivityData[];
  riskDistribution: RiskDistributionData[];
  documentVolume: DocumentVolumeData[];
  monthlyAnalysis: MonthlyAnalysisData[];
}

/**
 * Custom hook for managing dashboard chart analytics
 *
 * Fetches real-time analytics data from Convex and provides utilities
 * to determine if charts should be displayed based on data availability.
 *
 * @returns Object containing chart data and utility functions
 */
export function useChartAnalytics() {
  const { user } = useUser();

  // Fetch analytics data from Convex
  const analyticsData = useQuery(
    api.analytics.getDashboardAnalytics,
    user?.id ? { userId: user.id } : "skip"
  );

  // Fetch additional stats for analytics cards
  const analyticsStats = useQuery(
    api.analytics.getAnalyticsStats,
    user?.id ? { userId: user.id } : "skip"
  );

  /**
   * Checks if a chart has enough data to be rendered
   * @param chartType - The type of chart to check
   * @param data - The data array to validate
   * @returns True if chart should be rendered, false otherwise
   */
  const hasEnoughData = (
    chartType: keyof typeof CHART_MIN_DATA_REQUIREMENTS,
    data: any[]
  ): boolean => {
    if (!data || !Array.isArray(data)) return false;

    // For risk distribution, check if we have any analyses with risk scores
    if (chartType === "risk_distribution") {
      return data.some((item) => item.count > 0);
    }

    // For other charts, check minimum length and meaningful data
    const minRequired = CHART_MIN_DATA_REQUIREMENTS[chartType];
    if (data.length < minRequired) return false;

    // Check if data contains meaningful values (not all zeros)
    if (chartType === "weekly_activity") {
      return data.some((item) => item.uploads > 0 || item.reviews > 0);
    }

    if (chartType === "document_volume") {
      return data.some((item) => item.documents > 0);
    }

    if (chartType === "monthly_analysis") {
      return data.some(
        (item) =>
          item.contracts > 0 ||
          item.agreements > 0 ||
          item.ndas > 0 ||
          item.licenses > 0 ||
          item.others > 0
      );
    }

    return true;
  };

  /**
   * Gets chart-specific placeholder message when data is insufficient
   * @param chartType - The type of chart
   * @returns Appropriate placeholder message
   */
  const getPlaceholderMessage = (
    chartType: keyof typeof CHART_MIN_DATA_REQUIREMENTS
  ): string => {
    switch (chartType) {
      case "weekly_activity":
        return "Track your document processing workflow with weekly activity insights. Upload and analyze documents to populate this chart.";
      case "risk_distribution":
        return "Visualize risk assessment patterns across your legal documents. Complete document analyses to generate risk distribution data.";
      case "document_volume":
        return "Monitor document upload trends and volume patterns over time. Requires at least 2 months of document activity.";
      case "monthly_analysis":
        return "Compare document types and analysis patterns across months. Process documents to build comprehensive monthly insights.";
      default:
        return "Insufficient data available for chart generation. Continue using the platform to populate analytics.";
    }
  };

  // Default empty data structure
  const defaultData: ChartData = {
    weeklyActivity: [],
    riskDistribution: [],
    documentVolume: [],
    monthlyAnalysis: [],
  };

  return {
    // Data
    data: analyticsData || defaultData,
    stats: analyticsStats || {
      totalDocuments: 0,
      totalAnalyses: 0,
      avgRiskScore: 0,
      recentActivity: 0,
    },

    // Loading state
    isLoading: analyticsData === undefined || analyticsStats === undefined,

    // Utility functions
    hasEnoughData,
    getPlaceholderMessage,

    // Individual chart data checkers
    shouldShowWeeklyActivity: () =>
      hasEnoughData("weekly_activity", analyticsData?.weeklyActivity || []),
    shouldShowRiskDistribution: () =>
      hasEnoughData("risk_distribution", analyticsData?.riskDistribution || []),
    shouldShowDocumentVolume: () =>
      hasEnoughData("document_volume", analyticsData?.documentVolume || []),
    shouldShowMonthlyAnalysis: () =>
      hasEnoughData("monthly_analysis", analyticsData?.monthlyAnalysis || []),
  };
}
