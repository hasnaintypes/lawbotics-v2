import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRiskLevel, getRiskMessage } from "@/lib";

/**
 * Risk Score Component Props
 */
interface RiskScoreProps {
  /** The risk score value (0-100) */
  score?: number;
}

/**
 * Risk Score Component
 *
 * Displays a risk assessment card with score, level indicator, progress bar,
 * and descriptive message. Uses utility functions for consistent styling
 * and risk level determination across the application.
 *
 * Features:
 * - Risk level calculation and styling
 * - Progress bar visualization
 * - Contextual risk messages
 * - Fallback for missing risk data
 *
 * @param props - Component props
 * @returns JSX element representing the risk score card
 *
 * @example
 * ```tsx
 * <RiskScore score={75} />
 * ```
 */
export function RiskScore({ score }: RiskScoreProps) {
  if (!score && score !== 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No risk data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const risk = getRiskLevel(score);
  const Icon =
    risk.icon === "AlertTriangle"
      ? AlertTriangle
      : risk.icon === "Shield"
        ? Shield
        : CheckCircle;

  return (
    <Card className={`border-0 shadow-sm ${risk.bgColor}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${risk.color}`} />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${risk.color} mb-2`}>
            {score}%
          </div>
          <div className={`text-lg font-semibold ${risk.color}`}>
            {risk.level} Risk
          </div>
        </div>

        <Progress value={score} className="h-3" />

        <div className="text-sm text-muted-foreground text-center">
          {getRiskMessage(score)}
        </div>
      </CardContent>
    </Card>
  );
}
