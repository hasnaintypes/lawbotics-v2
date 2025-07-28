/**
 * 
 * Analysis Utility Functions
 *
 * Provides utility functions for analysis configuration, result processing,
 * and data transformation for the legal document analysis system.
 */

import type { AnalysisBias } from "@/constants/analysis-errors";

/**
 * Analysis configuration interface
 */
export interface AnalysisConfig {
  partyPerspective: string;
  analysisBias: AnalysisBias;
}

/**
 * Validates and sanitizes analysis result data
 * Provides fallback values for missing or invalid data
 *
 * @param result - Raw analysis result from AI
 * @returns Sanitized analysis result with fallbacks
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeAnalysisResult(rawResult);
 * // Returns validated result with fallbacks for missing fields
 * ```
 */
export function sanitizeAnalysisResult(result: any): any {
  const sanitized = { ...result };

  // Ensure document object exists with fallbacks
  if (!sanitized.document) {
    sanitized.document = {
      id: "unknown",
      title: "Document",
      type: "document",
      status: "unknown",
      parties: [],
      effectiveDate: "not specified",
      expirationDate: "not specified",
      value: "not specified",
    };
  }

  // Provide fallbacks for document fields
  sanitized.document = {
    id: sanitized.document.id || "unknown",
    title: sanitized.document.title || "Document",
    type: sanitized.document.type || "document",
    status: sanitized.document.status || "unknown",
    parties: Array.isArray(sanitized.document.parties)
      ? sanitized.document.parties
      : [],
    effectiveDate: sanitized.document.effectiveDate || "not specified",
    expirationDate: sanitized.document.expirationDate || "not specified",
    value: sanitized.document.value || "not specified",
  };

  // Ensure arrays exist
  sanitized.keyClauses = Array.isArray(sanitized.keyClauses)
    ? sanitized.keyClauses
    : [];
  sanitized.negotiableTerms = Array.isArray(sanitized.negotiableTerms)
    ? sanitized.negotiableTerms
    : [];
  sanitized.redFlags = Array.isArray(sanitized.redFlags)
    ? sanitized.redFlags
    : [];
  sanitized.recommendations = Array.isArray(sanitized.recommendations)
    ? sanitized.recommendations
    : [];

  // Ensure risk score is valid
  if (
    typeof sanitized.riskScore !== "number" ||
    sanitized.riskScore < 0 ||
    sanitized.riskScore > 100
  ) {
    sanitized.riskScore = 50; // Default moderate risk
  }

  return sanitized;
}

/**
 * Formats analysis data for display based on analysis type
 * Filters and organizes data according to the specific analysis view
 *
 * @param analysis - The analysis data from database
 * @returns Formatted data optimized for the analysis type
 *
 * @example
 * ```typescript
 * const formatted = formatAnalysisForDisplay(analysisData);
 * // Returns data structured for optimal display
 * ```
 */
export function formatAnalysisForDisplay(analysis: any): any {
  if (!analysis) return null;

  const formatted = { ...analysis };

  // Remove internal placeholders and "not specified" values from display
  const cleanDisplayValue = (value: string) => {
    const hiddenValues = [
      "not specified",
      "unknown",
      "not available",
      "not mentioned",
    ];
    return hiddenValues.includes(value?.toLowerCase()) ? null : value;
  };

  // Clean document display values
  if (formatted.document) {
    formatted.document.effectiveDate = cleanDisplayValue(
      formatted.document.effectiveDate
    );
    formatted.document.expirationDate = cleanDisplayValue(
      formatted.document.expirationDate
    );
    formatted.document.value = cleanDisplayValue(formatted.document.value);
  }

  // Filter out empty or placeholder items
  if (formatted.keyClauses) {
    formatted.keyClauses = formatted.keyClauses.filter(
      (clause: any) =>
        clause.title &&
        clause.analysis &&
        !clause.title.toLowerCase().includes("not available")
    );
  }

  if (formatted.redFlags) {
    formatted.redFlags = formatted.redFlags.filter(
      (flag: any) =>
        flag.title &&
        flag.description &&
        !flag.title.toLowerCase().includes("not available")
    );
  }

  if (formatted.recommendations) {
    formatted.recommendations = formatted.recommendations.filter(
      (rec: any) =>
        rec.title &&
        rec.description &&
        !rec.title.toLowerCase().includes("not available")
    );
  }

  return formatted;
}

/**
 * Gets the appropriate CSS classes for document status badges
 *
 * @param status - The document status string
 * @returns CSS classes for styling the status badge
 *
 * @example
 * ```typescript
 * const statusClasses = getStatusColor("completed");
 * // Returns: "bg-green-100 text-green-800 border-green-200"
 * ```
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "flagged":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Gets the appropriate CSS classes for analysis bias indicators
 *
 * @param bias - The analysis bias type (favorable, risk, neutral)
 * @returns CSS classes for styling the bias indicator
 *
 * @example
 * ```typescript
 * const biasClasses = getBiasColor("favorable");
 * // Returns: "bg-green-100 text-green-800"
 * ```
 */
export function getBiasColor(bias: string): string {
  switch (bias) {
    case "favorable":
      return "bg-green-100 text-green-800";
    case "risk":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
}

/**
 * Risk level configuration interface
 */
interface RiskLevel {
  level: string;
  color: string;
  bgColor: string;
  icon: string;
}

/**
 * Determines the risk level and associated styling based on risk score
 *
 * @param score - The risk score (0-100) or undefined
 * @returns Risk level configuration object with styling and metadata
 *
 * @example
 * ```typescript
 * const risk = getRiskLevel(75);
 * // Returns: { level: "High", color: "text-red-600", bgColor: "bg-red-50", icon: "AlertTriangle" }
 * ```
 */
export function getRiskLevel(score?: number): RiskLevel {
  if (!score && score !== 0) {
    return {
      level: "Unknown",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: "Shield",
    };
  }

  if (score >= 70) {
    return {
      level: "High",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: "AlertTriangle",
    };
  }

  if (score >= 40) {
    return {
      level: "Medium",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: "Shield",
    };
  }

  return {
    level: "Low",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: "CheckCircle",
  };
}

/**
 * Gets the appropriate CSS classes for severity indicators
 *
 * @param severity - The severity level (high, medium, low)
 * @returns CSS classes for styling the severity badge
 *
 * @example
 * ```typescript
 * const severityClasses = getSeverityColor("high");
 * // Returns: "bg-red-100 text-red-800 border-red-200"
 * ```
 */
export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Gets the appropriate CSS classes for importance level indicators
 *
 * @param importance - The importance level (critical, high, medium, low)
 * @returns CSS classes for styling the importance badge
 *
 * @example
 * ```typescript
 * const importanceClasses = getImportanceColor("critical");
 * // Returns: "bg-red-100 text-red-800 border-red-200"
 * ```
 */
export function getImportanceColor(importance: string): string {
  switch (importance.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Gets the appropriate CSS classes for priority level indicators
 *
 * @param priority - The priority level (high, medium, low)
 * @returns CSS classes for styling the priority badge
 *
 * @example
 * ```typescript
 * const priorityClasses = getPriorityColor("high");
 * // Returns: "bg-red-100 text-red-800 border-red-200"
 * ```
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Generates a descriptive message based on risk score
 *
 * @param riskScore - The risk score (0-100)
 * @returns Descriptive message about the risk level
 *
 * @example
 * ```typescript
 * const message = getRiskMessage(85);
 * // Returns: "This document contains significant risk factors requiring immediate attention."
 * ```
 */
export function getRiskMessage(riskScore: number): string {
  if (riskScore < 40) {
    return "This document presents minimal risk concerns.";
  }

  if (riskScore >= 40 && riskScore < 70) {
    return "This document has moderate risk factors that should be reviewed.";
  }

  return "This document contains significant risk factors requiring immediate attention.";
}


