import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsCardProps {
  /** Card title */
  title: string
  /** Main metric value */
  value: string | number
  /** Percentage change */
  change: string
  /** Lucide icon component */
  icon: LucideIcon
  /** Trend direction */
  trend: "up" | "down" | "neutral"
}

/**
 * Analytics card component for displaying contract metrics
 * @param {AnalyticsCardProps} props - Card properties
 * @returns {JSX.Element} Analytics card
 */
export function AnalyticsCard({ title, value, change, icon: Icon, trend }: AnalyticsCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-2 border-primary/10 shadow-sm bg-gradient-to-br from-background to-muted/20 hover:border-primary/20 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">{title}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{value}</div>
      </CardContent>
    </Card>
  )
}
