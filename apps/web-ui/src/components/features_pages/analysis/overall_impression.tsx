import { ThumbsUp, ThumbsDown, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface OverallImpressionProps {
  impression: {
    summary: string
    pros: string[]
    cons: string[]
    conclusion: string
  }
}

export function OverallImpression({ impression }: OverallImpressionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pros */}
      <Card className="border-0 shadow-sm bg-green-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Positive Aspects</h4>
          </div>
          <ul className="space-y-2">
            {impression.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cons */}
      <Card className="border-0 shadow-sm bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-red-900">Areas of Concern</h4>
          </div>
          <ul className="space-y-2">
            {impression.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-sm bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Conclusion</h4>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{impression.conclusion}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
