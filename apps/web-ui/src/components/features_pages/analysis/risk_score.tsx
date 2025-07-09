import { Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RiskScoreProps {
  score?: number
}

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
          <p className="text-muted-foreground text-center py-4">No risk data available</p>
        </CardContent>
      </Card>
    )
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle }
    if (score >= 40) return { level: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Shield }
    return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle }
  }

  const risk = getRiskLevel(score)
  const Icon = risk.icon

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
          <div className={`text-4xl font-bold ${risk.color} mb-2`}>{score}%</div>
          <div className={`text-lg font-semibold ${risk.color}`}>{risk.level} Risk</div>
        </div>

        <Progress value={score} className="h-3" />

        <div className="text-sm text-muted-foreground text-center">
          {score < 40 && "This document presents minimal risk concerns."}
          {score >= 40 && score < 70 && "This document has moderate risk factors that should be reviewed."}
          {score >= 70 && "This document contains significant risk factors requiring immediate attention."}
        </div>
      </CardContent>
    </Card>
  )
}
