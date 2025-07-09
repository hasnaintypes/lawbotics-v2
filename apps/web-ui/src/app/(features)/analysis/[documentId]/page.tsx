"use client"

import { useParams, useRouter } from "next/navigation"
import {
  Loader2,
  FileX,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Lightbulb,
  Edit,
  Users,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Star,
  Target,
  ArrowRight,
} from "lucide-react"
import { useAnalysisStore } from "@/store/analysis.store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"

export default function DocumentAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.documentId as Id<"documents">

  const { analyses } = useAnalysisStore()
  const analysis = analyses.find(a => a._id === documentId as unknown as Id<"analyses">)

  if (!analysis) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <FileX className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-xl font-bold">Analysis Not Found</h2>
            <p className="text-muted-foreground">
              The document analysis you are looking for does not exist in your local storage. Please analyze the document from the dashboard.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (analysis.status === "processing") {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Analyzing Document</h2>
            <p className="text-muted-foreground">Please wait while we analyze your document...</p>
          </div>
        </div>
      </div>
    )
  }

  if (analysis.status === "failed") {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-destructive">Analysis Failed</h2>
            <p className="text-muted-foreground">
              We encountered an error while analyzing this document. Please try again later.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "flagged":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case "favorable":
        return "bg-green-100 text-green-800"
      case "risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getRiskLevel = (score?: number) => {
    if (!score && score !== 0) return { level: "Unknown", color: "text-gray-600", bgColor: "bg-gray-50", icon: Shield }
    if (score >= 70) return { level: "High", color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle }
    if (score >= 40) return { level: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Shield }
    return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle }
  }

  const risk = getRiskLevel(analysis.riskScore)
  const RiskIcon = risk.icon

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
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "high":
        return <Star className="h-4 w-4 text-orange-600" />
      default:
        return <FileText className="h-4 w-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" className="mr-3 p-2" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{analysis.document.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="outline" className={getStatusColor(analysis.document.status)}>
                  {analysis.document.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {analysis.partyPerspective}
                </span>
                <Badge className={getBiasColor(analysis.analysisBias)}>{analysis.analysisBias} analysis</Badge>
                <Badge variant="secondary">{analysis.analysisDepth} depth</Badge>
              </div>
            </div>
          </div>

          {/* Document Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">{analysis.document.type}</p>
                    <p className="text-xs text-blue-700">Document Type</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {analysis.document.effectiveDate && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {new Date(analysis.document.effectiveDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-green-700">Effective Date</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.document.value && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-900">{analysis.document.value}</p>
                      <p className="text-xs text-purple-700">Contract Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Document Metadata and Risk Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* Document Metadata */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Document Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Parties */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Parties Involved
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.document.parties.map((party, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysis.document.effectiveDate && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Effective Date
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(analysis.document.effectiveDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {analysis.document.expirationDate && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Expiration Date
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(analysis.document.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contract Value */}
                {analysis.document.value && analysis.document.value !== "N/A" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Contract Value
                    </div>
                    <p className="text-sm font-medium">{analysis.document.value}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            {/* Risk Score */}
            <Card className={`border-0 shadow-sm ${risk.bgColor}`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <RiskIcon className={`h-5 w-5 ${risk.color}`} />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.riskScore || analysis.riskScore === 0 ? (
                  <>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${risk.color} mb-2`}>{analysis.riskScore}%</div>
                      <div className={`text-lg font-semibold ${risk.color}`}>{risk.level} Risk</div>
                    </div>

                    <Progress value={analysis.riskScore} className="h-3" />

                    <div className="text-sm text-muted-foreground text-center">
                      {analysis.riskScore < 40 && "This document presents minimal risk concerns."}
                      {analysis.riskScore >= 40 &&
                        analysis.riskScore < 70 &&
                        "This document has moderate risk factors that should be reviewed."}
                      {analysis.riskScore >= 70 &&
                        "This document contains significant risk factors requiring immediate attention."}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No risk data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Executive Summary */}
        {analysis.overallImpression && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-xl bg-muted/30 p-6 border-l-4 border-primary">
                  <p className="text-muted-foreground leading-relaxed">{analysis.overallImpression.summary}</p>
                </div>

                {/* Overall Impression */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pros */}
                  <Card className="border-0 shadow-sm bg-green-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ThumbsUp className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Positive Aspects</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysis.overallImpression.pros.map((pro, index) => (
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
                        {analysis.overallImpression.cons.map((con, index) => (
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
                        <p className="text-sm text-blue-800 leading-relaxed">{analysis.overallImpression.conclusion}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analysis Sections */}
        <Accordion
          type="multiple"
          defaultValue={["red-flags", "recommendations", "key-clauses", "negotiable-terms"]}
          className="space-y-4"
        >
          {/* Red Flags */}
          {analysis.redFlags && analysis.redFlags.length > 0 && (
            <AccordionItem value="red-flags" className="border rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Key Issues & Red Flags</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.redFlags.length} issue{analysis.redFlags.length !== 1 ? "s" : ""} identified
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <div className="space-y-4">
                  {analysis.redFlags.map((flag, index) => (
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
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <AccordionItem value="recommendations" className="border rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Recommendations & Action Items</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.recommendations.length} recommendation{analysis.recommendations.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
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
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Key Clauses */}
          {analysis.keyClauses && analysis.keyClauses.length > 0 && (
            <AccordionItem value="key-clauses" className="border rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Key Clauses Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.keyClauses.length} clause{analysis.keyClauses.length !== 1 ? "s" : ""} analyzed
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <div className="space-y-6">
                  {analysis.keyClauses.map((clause, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                              {getImportanceIcon(clause.importance)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{clause.title}</h4>
                              <p className="text-sm text-muted-foreground">{clause.section}</p>
                            </div>
                          </div>
                          <Badge className={getImportanceColor(clause.importance)}>
                            {clause.importance} importance
                          </Badge>
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
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Negotiable Terms */}
          {analysis.negotiableTerms && analysis.negotiableTerms.length > 0 && (
            <AccordionItem value="negotiable-terms" className="border rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Edit className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Negotiable Terms</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.negotiableTerms.length} term{analysis.negotiableTerms.length !== 1 ? "s" : ""} to
                      consider
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <div className="space-y-6">
                  {analysis.negotiableTerms.map((term, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-green-100 rounded-lg shrink-0">
                              <Edit className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{term.title}</h4>
                              <p className="text-sm text-muted-foreground">{term.description}</p>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(term.priority)}>{term.priority} priority</Badge>
                        </div>

                        <div className="space-y-4 pl-11">
                          {/* Current vs Suggested Language */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-foreground text-sm">Current Language</h5>
                              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                                <p className="text-sm text-red-800 leading-relaxed">{term.currentLanguage}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-medium text-foreground text-sm">Suggested Language</h5>
                              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                                <p className="text-sm text-green-800 leading-relaxed">{term.suggestedLanguage}</p>
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
                              <p className="text-sm text-blue-800 leading-relaxed">{term.rationale}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  )
}
