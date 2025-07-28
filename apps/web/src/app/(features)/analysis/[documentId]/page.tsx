"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileX,
  Lightbulb,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAnalysisFetch } from "@/hooks";
import {
  RedFlags,
  Recommendations,
  KeyClauses,
  NegotiableTerms,
  DocumentMetadata,
  RiskScore,
  OverallImpression,
} from "@/components/feature-pages/analysis";
import { getStatusColor, getBiasColor } from "@/lib";

/**
 * Document Analysis Page Component
 *
 * This page displays comprehensive analysis results for a legal document.
 * It fetches analysis data using multiple strategies and provides detailed
 * insights including risk assessment, key clauses, recommendations, and more.
 *
 * Features:
 * - Smart data fetching from store and API
 * - Comprehensive loading and error states
 * - Professional loading indicators
 * - Detailed analysis visualization
 * - Interactive accordion sections
 * - Risk scoring and assessment
 * - Document metadata display
 *
 * @returns JSX element representing the analysis page
 */
export default function DocumentAnalysisPage() {
  const router = useRouter();

  // Use the custom hook for fetching analysis data
  const {
    analysis,
    document,
    paramValue,
    isLoading,
    isDocumentNotFound,
    isAnalysisFailed,
    isAnalysisProcessing,
  } = useAnalysisFetch();

  console.log("Param value:", paramValue);
  console.log("Document:", document);
  console.log("Analysis:", analysis);

  // Loading state while fetching analysis
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <LoadingSpinner
          title="Loading Analysis..."
          description="Please wait while we fetch your document analysis"
          subtitle={`Parameter: ${paramValue}`}
          size="lg"
        />
      </div>
    );
  }

  // Document not found
  if (isDocumentNotFound) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <FileX className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-bold">Document Not Found</h2>
            <p className="text-muted-foreground">
              The document with ID "{paramValue}" could not be found.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This document may have been deleted or you may not have access to
              it.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Analysis failed
  if (isAnalysisFailed) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-bold">Analysis Failed</h2>
            <p className="text-muted-foreground">
              There was an error analyzing your document. Please try again.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Document: {document?.title || "Unknown"}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Analysis not found or still processing
  if (isAnalysisProcessing) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <LoadingSpinner
          title={analysis ? "Analysis in Progress..." : "No Analysis Found"}
          description={
            analysis
              ? "Your document is being analyzed. This page will automatically update when complete."
              : "No analysis has been started for this document yet."
          }
          subtitle={`Document: ${document?.title || "Unknown"}`}
          size="lg"
          showDots={!!analysis}
        />
      </div>
    );
  }

  // At this point, analysis exists and status is "complete"
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="mr-3 p-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {analysis.document.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className={getStatusColor(analysis.document.status)}
                >
                  {analysis.document.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {analysis.partyPerspective}
                </span>
                <Badge className={getBiasColor(analysis.analysisBias)}>
                  {analysis.analysisBias} analysis
                </Badge>
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
                    <p className="text-sm font-medium text-blue-900">
                      {analysis.document.type}
                    </p>
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
                        {new Date(
                          analysis.document.effectiveDate
                        ).toLocaleDateString()}
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
                      <p className="text-sm font-medium text-purple-900">
                        {analysis.document.value}
                      </p>
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
            <DocumentMetadata document={analysis.document} />
          </div>
          <div>
            <RiskScore score={analysis.riskScore} />
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
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.overallImpression.summary}
                  </p>
                </div>

                <OverallImpression impression={analysis.overallImpression} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analysis Sections */}
        <Accordion
          type="multiple"
          defaultValue={[
            "red-flags",
            "recommendations",
            "key-clauses",
            "negotiable-terms",
          ]}
          className="space-y-4"
        >
          {/* Red Flags */}
          {analysis.redFlags && analysis.redFlags.length > 0 && (
            <AccordionItem
              value="red-flags"
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Key Issues & Red Flags
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.redFlags.length} issue
                      {analysis.redFlags.length !== 1 ? "s" : ""} identified
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <RedFlags flags={analysis.redFlags} />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <AccordionItem
              value="recommendations"
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Recommendations & Action Items
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.recommendations.length} recommendation
                      {analysis.recommendations.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <Recommendations recommendations={analysis.recommendations} />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Key Clauses */}
          {analysis.keyClauses && analysis.keyClauses.length > 0 && (
            <AccordionItem
              value="key-clauses"
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Key Clauses Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.keyClauses.length} clause
                      {analysis.keyClauses.length !== 1 ? "s" : ""} analyzed
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <KeyClauses clauses={analysis.keyClauses} />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Negotiable Terms */}
          {analysis.negotiableTerms && analysis.negotiableTerms.length > 0 && (
            <AccordionItem
              value="negotiable-terms"
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Edit className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Negotiable Terms</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.negotiableTerms.length} term
                      {analysis.negotiableTerms.length !== 1 ? "s" : ""} to
                      consider
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <NegotiableTerms terms={analysis.negotiableTerms} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
