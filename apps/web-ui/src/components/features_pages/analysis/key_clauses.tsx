import { FileText, Star, AlertCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeyClause {
  title: string
  section: string
  text: string
  importance: string
  analysis: string
  recommendation?: string
}

interface KeyClausesProps {
  clauses: KeyClause[]
}

export function KeyClauses({ clauses }: KeyClausesProps) {
  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "high":
        return <Star className="h-4 w-4 text-orange-600" />
      default:
        return <FileText className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {clauses.map((clause, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">{getImportanceIcon(clause.importance)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{clause.title}</h4>
                  <p className="text-sm text-muted-foreground">{clause.section}</p>
                </div>
              </div>
              <Badge className={getImportanceColor(clause.importance)}>{clause.importance} importance</Badge>
            </div>

            <div className="space-y-4 pl-11">
              {/* Clause Text */}
              <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-muted-foreground italic leading-relaxed">{clause.text}</p>
              </div>

              {/* Analysis */}
              <div>
                <h5 className="font-medium text-foreground mb-2">Analysis</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{clause.analysis}</p>
              </div>

              {/* Recommendation */}
              {clause.recommendation && (
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <h5 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Recommendation
                  </h5>
                  <p className="text-sm text-yellow-800 leading-relaxed">{clause.recommendation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
