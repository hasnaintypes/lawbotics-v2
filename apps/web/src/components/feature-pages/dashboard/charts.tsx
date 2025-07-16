"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import {
  useChartAnalytics,
  type WeeklyActivityData,
  type RiskDistributionData,
  type DocumentVolumeData,
  type MonthlyAnalysisData,
} from "@/hooks";
import { ChartPlaceholder } from "./chart_placeholder";
import { ChartLoading } from "./chart-loading";
import { useChartColors } from "@/lib";

/**
 * Props for the Charts component
 */
interface ChartsProps {
  /** The type of chart to render */
  type:
    | "weekly_activity"
    | "risk_distribution"
    | "document_volume"
    | "monthly_analysis";
}

/**
 * Charts Component
 *
 * Renders different types of charts for dashboard analytics including:
 * - Weekly activity trends
 * - Risk distribution pie charts
 * - Document volume over time
 * - Monthly analysis comparisons
 *
 * Uses real-time data from Convex and automatically adapts to light/dark themes.
 * Shows placeholders when insufficient data is available.
 *
 * @param props - The component props
 * @returns A responsive chart component or placeholder
 */
export function Charts({ type }: ChartsProps) {
  const { data, hasEnoughData, getPlaceholderMessage, isLoading } =
    useChartAnalytics();

  const { chartColors } = useChartColors();

  // Show loading state
  if (isLoading) {
    return (
      <ChartLoading
        title="Loading Chart Data"
        description="Fetching analytics from your documents"
      />
    );
  }

  if (type === "weekly_activity") {
    if (!hasEnoughData("weekly_activity", data.weeklyActivity)) {
      return (
        <ChartPlaceholder
          message={getPlaceholderMessage("weekly_activity")}
          chartType="bar"
        />
      );
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.weeklyActivity}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis
              dataKey="day"
              className="text-xs"
              stroke={chartColors.border}
            />
            <YAxis className="text-xs" stroke={chartColors.border} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.background,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="uploads"
              name="Uploads"
              fill={chartColors.primary}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="reviews"
              name="Reviews"
              fill={chartColors.chart3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "risk_distribution") {
    if (!hasEnoughData("risk_distribution", data.riskDistribution)) {
      return (
        <ChartPlaceholder
          message={getPlaceholderMessage("risk_distribution")}
          chartType="pie"
        />
      );
    }

    // Map data with resolved colors
    const riskData = data.riskDistribution.map((item, index) => ({
      ...item,
      fill:
        [chartColors.chart1, chartColors.chart2, chartColors.chart3][index] ||
        chartColors.chart1,
    }));

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.background,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "8px",
              }}
              formatter={(value, name) => [
                `${value}% (${riskData.find((d) => d.name === name)?.count || 0} documents)`,
                "Percentage",
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "document_volume") {
    if (!hasEnoughData("document_volume", data.documentVolume)) {
      return (
        <ChartPlaceholder
          message={getPlaceholderMessage("document_volume")}
          chartType="area"
        />
      );
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.documentVolume}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke={chartColors.border}
            />
            <YAxis className="text-xs" stroke={chartColors.border} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.background,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="documents"
              name="Documents"
              stroke={chartColors.primary}
              fillOpacity={1}
              fill="url(#colorDocuments)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "monthly_analysis") {
    if (!hasEnoughData("monthly_analysis", data.monthlyAnalysis)) {
      return (
        <ChartPlaceholder
          message={getPlaceholderMessage("monthly_analysis")}
          chartType="bar"
        />
      );
    }

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.monthlyAnalysis}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.chart1}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.chart1}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorAgreements" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.chart2}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.chart2}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorNdas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.chart3}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.chart3}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorLicenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.chart4}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.chart4}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors.chart5}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors.chart5}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke={chartColors.border}
            />
            <YAxis className="text-xs" stroke={chartColors.border} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.background,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="contracts"
              name="Contracts"
              stackId="1"
              stroke={chartColors.chart1}
              fill="url(#colorContracts)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="agreements"
              name="Agreements"
              stackId="1"
              stroke={chartColors.chart2}
              fill="url(#colorAgreements)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="ndas"
              name="NDAs"
              stackId="1"
              stroke={chartColors.chart3}
              fill="url(#colorNdas)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="licenses"
              name="Licenses"
              stackId="1"
              stroke={chartColors.chart4}
              fill="url(#colorLicenses)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="others"
              name="Others"
              stackId="1"
              stroke={chartColors.chart5}
              fill="url(#colorOthers)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <p className="text-muted-foreground">Chart type not supported</p>
    </div>
  );
}
