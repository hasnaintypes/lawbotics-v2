import { AnalyticsCard } from "./analytics-card";
import { useContractAnalytics } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import * as Icons from "lucide-react";

/**
 * Analytics section component displaying key contract metrics from Convex
 * @returns {JSX.Element} Analytics cards grid
 */
export function AnalyticsSection() {
  const { analytics, isLoading } = useContractAnalytics();

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {analytics.map((analytic: any) => {
        // Dynamically get the icon component
        const IconComponent = Icons[analytic.icon as keyof typeof Icons] as any;

        return (
          <AnalyticsCard
            key={analytic.id}
            title={analytic.title}
            value={analytic.value}
            change={analytic.change}
            icon={IconComponent}
            trend={analytic.trend}
          />
        );
      })}
    </section>
  );
}

/**
 * Loading skeleton for analytics section
 * @returns {JSX.Element} Skeleton component
 */
function AnalyticsSkeleton() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border-2 border-primary/10 p-6 space-y-3"
        >
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </section>
  );
}
