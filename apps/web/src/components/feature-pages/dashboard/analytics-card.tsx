import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Props for the AnalyticsCard component
 */
interface AnalyticsCardProps {
  /** The title/label of the analytics metric */
  title: string;
  /** The main value to display (e.g., number, percentage) */
  value: string;
  /** Optional change indicator text (e.g., "+12 from last month") */
  change?: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Tailwind CSS classes for icon background color */
  iconColor: string;
  /** Visual trend indicator for the metric */
  trend: "up" | "down" | "neutral";
  /** Optional descriptive text */
  description?: string;
  /** Optional badge text to display near the title */
  badge?: string;
}

/**
 * AnalyticsCard Component
 *
 * Displays a dashboard analytics metric in a card format with icon, value,
 * change indicator, and optional badge. Used throughout the dashboard to
 * show key performance indicators and metrics.
 *
 * @param props - The component props
 * @returns A styled card component displaying the analytics metric
 *
 * @example
 * ```tsx
 * <AnalyticsCard
 *   title="Total Documents"
 *   value="124"
 *   change="+12 from last month"
 *   icon={FileText}
 *   iconColor="bg-blue-100 text-blue-600"
 *   trend="up"
 *   description="Documents processed"
 * />
 * ```
 */
export function AnalyticsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  trend,
  description,
  badge,
}: AnalyticsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center justify-between">
            {change && (
              <p
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
