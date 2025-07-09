import { AlertTriangle, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RedFlag {
  title: string
  description: string
  severity: string
  location?: string
}

interface RedFlagsProps {
  flags: RedFlag[]
}

export function RedFlags({ flags }: RedFlagsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {flags.map((flag, index) => (
        <Card key={index} className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{flag.title}</h4>
                  {flag.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {flag.location}
                    </div>
                  )}
                </div>
              </div>
              <Badge className={getSeverityColor(flag.severity)}>{flag.severity} severity</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">{flag.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
