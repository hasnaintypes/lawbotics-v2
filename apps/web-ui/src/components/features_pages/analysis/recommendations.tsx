import { Lightbulb, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Recommendation {
  title: string
  description: string
}

interface RecommendationsProps {
  recommendations: Recommendation[]
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <Card key={index} className="border-l-4 border-l-yellow-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg shrink-0">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  {rec.title}
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
