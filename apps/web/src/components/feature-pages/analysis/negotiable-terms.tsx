import { Edit, ArrowRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib";

/**
 * Negotiable term interface definition
 */
interface NegotiableTerm {
  title: string;
  description: string;
  priority: string;
  currentLanguage: string;
  suggestedLanguage: string;
  rationale?: string;
}

/**
 * Props for the NegotiableTerms component
 */
interface NegotiableTermsProps {
  terms: NegotiableTerm[];
}

/**
 * NegotiableTerms Component
 *
 * Displays negotiable terms identified in the document analysis.
 * Each term includes current vs suggested language, priority level,
 * and rationale for the suggested changes.
 *
 * @param props - Component props containing the terms array
 * @returns JSX element displaying the negotiable terms
 *
 * @example
 * ```tsx
 * <NegotiableTerms terms={analysis.negotiableTerms} />
 * ```
 */
export function NegotiableTerms({ terms }: NegotiableTermsProps) {
  return (
    <div className="space-y-6">
      {terms.map((term, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Edit className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {term.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {term.description}
                  </p>
                </div>
              </div>
              <Badge className={getPriorityColor(term.priority)}>
                {term.priority} priority
              </Badge>
            </div>

            <div className="space-y-4 pl-11">
              {/* Current vs Suggested Language */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-foreground text-sm">
                    Current Language
                  </h5>
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-sm text-red-800 leading-relaxed">
                      {term.currentLanguage}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-foreground text-sm">
                    Suggested Language
                  </h5>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-green-800 leading-relaxed">
                      {term.suggestedLanguage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow indicator for mobile */}
              <div className="flex justify-center lg:hidden">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Rationale */}
              {term.rationale && (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Rationale
                  </h5>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {term.rationale}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
