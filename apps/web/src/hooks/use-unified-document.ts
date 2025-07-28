"use client";
import { useMemo, useEffect } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { formatDateForDisplay } from "@/lib";
import type { DocumentEntry } from "@/lib";
import type { Id } from "../../convex/_generated/dataModel";
import { useAnalysisStore } from "@/store/analysis.store";

/**
 * Custom hook for unified document and analysis data
 *
 * Combines documents and their analyses into a single unified view,
 * showing both analyzed and unanalyzed documents with appropriate
 * status indicators and actions. Also updates the analysis store
 * with the latest data for caching and performance.
 *
 * @param userId - The user ID to fetch documents for
 * @returns Object containing unified documents, loading state, and error
 */
export function useUnifiedDocuments(userId?: string) {
  const { user } = useUser();
  const { analyses: storeAnalyses, addOrUpdateAnalysis } = useAnalysisStore();

  // Fetch all documents for the user
  const documents = useQuery(
    api.documents.getDocuments,
    userId ? { userId } : "skip"
  );

  // Fetch all analyses for the user
  const analyses = useQuery(
    api.analyses.getLatestUniqueAnalysesForUser,
    userId ? { userId } : "skip"
  );

  // Create a map of document ID to analysis for quick lookup
  const analysisMap = useMemo(() => {
    if (!analyses) return new Map();

    const map = new Map<Id<"documents">, (typeof analyses)[0]>();
    analyses.forEach((analysis: any) => {
      if (analysis.documentId) {
        map.set(analysis.documentId, analysis);
      }
    });
    return map;
  }, [analyses]);

  // Combine documents with their analysis status
  const unifiedDocuments = useMemo((): DocumentEntry[] => {
    if (!documents) return [];

    return documents.map((doc) => {
      const analysis = analysisMap.get(doc._id);
      const hasAnalysis = !!analysis;
      const isAnalyzed = hasAnalysis && analysis.status === "complete";

      return {
        id: hasAnalysis ? analysis._id : doc._id,
        documentId: doc._id,
        title: doc.title || "Untitled Document",
        type: doc.fileType || "Document",
        date: formatDateForDisplay(doc._creationTime),
        status: hasAnalysis ? analysis.status || "Processing" : "Uploaded",
        risk_score:
          isAnalyzed &&
          analysis.riskScore !== undefined &&
          analysis.riskScore !== null
            ? analysis.riskScore.toString()
            : hasAnalysis && analysis.status === "processing"
              ? "Analyzing..."
              : "Not Analyzed",
        last_modified: formatDateForDisplay(
          hasAnalysis ? analysis._creationTime : doc._creationTime
        ),
        author: user?.fullName || user?.firstName || "User", // Use actual user name
        description: isAnalyzed
          ? (analysis as any)?.summary || "No description available"
          : hasAnalysis
            ? "Analysis in progress"
            : "Document ready for analysis",
        hasAnalysis,
        analysisId: analysis?._id,
        analysisStatus: analysis?.status,
        isAnalyzed,
      };
    });
  }, [documents, analysisMap]);

  // Update the analysis store when analyses are fetched
  useEffect(() => {
    if (analyses) {
      analyses.forEach((analysis) => {
        addOrUpdateAnalysis(analysis);
      });
    }
  }, [analyses, addOrUpdateAnalysis]);

  // Update analysis store when analyses change
  useEffect(() => {
    if (analyses && analyses.length > 0) {
      analyses.forEach((analysis) => {
        addOrUpdateAnalysis({
          ...analysis,
          author: user?.fullName || user?.firstName || "User",
        });
      });
    }
  }, [analyses, addOrUpdateAnalysis, user]);

  return {
    documents: unifiedDocuments,
    isLoading: documents === undefined || analyses === undefined,
    error: null, // Add error handling if needed
    rawDocuments: documents,
    rawAnalyses: analyses,
  };
}
