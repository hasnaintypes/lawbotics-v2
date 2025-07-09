"use client"

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
} from "recharts"
import { weekly_activity_data, risk_distribution_data , document_volume_data,monthly_analysis_data, CHART_MIN_DATA_REQUIREMENTS, } from "@/constants/chart_data"
import { useEffect, useState } from "react";

interface ChartsProps {
  type: "weekly_activity" | "risk_distribution" | "document_volume" | "monthly_analysis"
}

function ChartPlaceholder({ message }: { message: string }) {
  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
      <div className="text-center space-y-2">
        <div className="text-4xl">📊</div>
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">Data will appear here once available</p>
      </div>
    </div>
  )
}

function getCssVarValue(variableName: string) {
  if (typeof window === "undefined") return ""; 
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export function Charts({ type }: ChartsProps) {
  const [chartColors, setChartColors] = useState({
    chart1: "#8884d8",
    chart2: "#82ca9d",
    chart3: "#ffc658",
    chart4: "#ff7300",
    chart5: "#a4de6c",
    primary: "#6366f1",
    background: "#fff",
    border: "#e5e7eb",
  });

  useEffect(() => {
    function updateColors() {
      setChartColors({
        chart1: getCssVarValue('--chart-1') || '#8884d8',
        chart2: getCssVarValue('--chart-2') || '#82ca9d',
        chart3: getCssVarValue('--chart-3') || '#ffc658',
        chart4: getCssVarValue('--chart-4') || '#ff7300',
        chart5: getCssVarValue('--chart-5') || '#a4de6c',
        primary: getCssVarValue('--primary') || '#6366f1',
        background: getCssVarValue('--background') || '#fff',
        border: getCssVarValue('--border') || '#e5e7eb',
      });
    }
    updateColors();
    window.addEventListener('themechange', updateColors);
    return () => window.removeEventListener('themechange', updateColors);
  }, []);

  const hasEnoughData = (chartType: keyof typeof CHART_MIN_DATA_REQUIREMENTS, data: any[]) => {
    return data.length >= CHART_MIN_DATA_REQUIREMENTS[chartType]
  }

  if (type === "weekly_activity") {
    if (!hasEnoughData("weekly_activity", weekly_activity_data)) {
      return <ChartPlaceholder message="Not enough weekly activity data" />
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly_activity_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="day" className="text-xs" stroke={chartColors.border} />
            <YAxis className="text-xs" stroke={chartColors.border} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.background,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="uploads" name="Uploads" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="reviews" name="Reviews" fill={chartColors.chart3} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "risk_distribution") {
    if (!hasEnoughData("risk_distribution", risk_distribution_data)) {
      return <ChartPlaceholder message="Not enough risk data" />
    }
    // Map data with resolved colors
    const riskData = [
      { ...risk_distribution_data[0], fill: chartColors.chart1 },
      { ...risk_distribution_data[1], fill: chartColors.chart2 },
      { ...risk_distribution_data[2], fill: chartColors.chart3 },
    ];
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
              formatter={(value) => [`${value}%`, "Percentage"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "document_volume") {
    if (!hasEnoughData("document_volume", document_volume_data)) {
      return <ChartPlaceholder message="Not enough document volume data" />
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={document_volume_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="month" className="text-xs" stroke={chartColors.border} />
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
    )
  }

  if (type === "monthly_analysis") {
    if (!hasEnoughData("monthly_analysis", monthly_analysis_data)) {
      return <ChartPlaceholder message="Not enough monthly analysis data" />
    }

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthly_analysis_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.chart1} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.chart1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAgreements" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.chart2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.chart2} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNdas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.chart3} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.chart3} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLicenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.chart4} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.chart4} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOthers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.chart5} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.chart5} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
            <XAxis dataKey="month" className="text-xs" stroke={chartColors.border} />
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
    )
  }

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <p className="text-muted-foreground">Chart type not supported</p>
    </div>
  )
}
