import { Lightbulb, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Recommendation interface definition
 */
interface Recommendation {
  title: string;
  description: string;
}

/**
 * Props for the Recommendations component
 */
interface RecommendationsProps {
  recommendations: Recommendation[];
}

/**
 * Recommendations Component
 * 
 * Displays a list of recommendations for the analyzed document.
 * Each recommendation includes a title and detailed description
 * with appropriate visual indicators.
 * 
 * @param props - Component props containing the recommendations array
 * @returns JSX element displaying the recommendations
 * 
 * @example
 * ```tsx
 * <Recommendations recommendations={analysis.recommendations} />
 * ```
 */
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
