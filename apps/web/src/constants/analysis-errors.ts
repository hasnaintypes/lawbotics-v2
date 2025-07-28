/**
 * Analysis Error Constants
 *
 * Centralized error handling for document analysis operations.
 * Provides consistent error messages and categorization for different failure scenarios.
 */

/**
 * Analysis error types and their corresponding user-friendly messages
 */
export const ANALYSIS_ERROR_MESSAGES = {
  SERVICE_UNAVAILABLE:
    "Service Temporarily Unavailable: Our AI analysis service is experiencing high demand. Please try again in a few minutes.",
  RATE_LIMITED:
    "Too Many Requests: Please wait a moment before starting another analysis. This helps ensure quality service for everyone.",
  CONNECTION_ERROR:
    "Connection Issue: Please check your internet connection and try again.",
  TIMEOUT_ERROR:
    "Request Timeout: The analysis request took too long to process. Please try again.",
  NETWORK_OVERLOAD:
    "Network Issue: The AI service is temporarily overloaded. Please try again in a few moments.",
  GENERIC_ERROR:
    "Analysis Error: An unexpected error occurred. Please try again.",
  UNKNOWN_ERROR: "Unknown error occurred",
} as const;

/**
 * Error classification patterns for matching error messages
 */
export const ERROR_PATTERNS = {
  SERVICE_UNAVAILABLE: ["503", "Service Unavailable"],
  RATE_LIMITED: ["429", "rate limit"],
  CONNECTION: ["network", "connection", "fetch", "Connection"],
  TIMEOUT: ["timeout"],
} as const;

/**
 * Analysis loading states and messages
 */
export const ANALYSIS_LOADING_MESSAGES = {
  INITIALIZING: "Initializing analysis...",
  CONNECTING: "Connecting to AI analysis service...",
  SUCCESS: "Analysis started successfully! Redirecting...",
  PROCESSING: "Processing your request...",
} as const;

/**
 * Analysis configuration options
 */
export const ANALYSIS_OPTIONS = {
  PERSPECTIVES: {
    NEUTRAL: {
      value: "neutral",
      label: "Neutral (Balanced Analysis)",
      description: "Balanced analysis without bias",
    },
    OTHER: {
      value: "other",
      label: "Other (specify)",
      description: "Custom perspective",
    },
  },
  TYPES: {
    FULL: {
      value: "full" as const,
      label: "Full Analysis",
      description: "Comprehensive analysis with all sections",
      icon: "FileText",
    },
    SUMMARY: {
      value: "summary" as const,
      label: "Quick Summary",
      description: "Brief overview with key insights",
      icon: "Eye",
    },
    NEUTRAL: {
      value: "neutral" as const,
      label: "Neutral Review",
      description: "Balanced analysis without bias",
      icon: "Scale",
    },
    FAVORABLE: {
      value: "favorable" as const,
      label: "Favorable Analysis",
      description: "Highlight advantages and opportunities",
      icon: "TrendingUp",
    },
  },
  DEPTH: {
    SUMMARY: {
      value: "summary" as const,
      label: "Short summary",
    },
    FULL: {
      value: "full" as const,
      label: "Full analysis",
    },
  },
  BIAS: {
    NEUTRAL: {
      value: "neutral" as const,
      label: "Neutral",
      description: "Balanced analysis without bias",
    },
    FAVORABLE: {
      value: "favorable" as const,
      label: "In favor of selected party",
      description: "Highlight advantages for your side",
    },
    RISK: {
      value: "risk" as const,
      label: "Flag risky clauses",
      description: "Focus on potential risks and issues",
    },
  },
} as const;

/**
 * Type definitions for analysis configuration
 */
export type AnalysisBias =
  | typeof ANALYSIS_OPTIONS.BIAS.NEUTRAL.value
  | typeof ANALYSIS_OPTIONS.BIAS.FAVORABLE.value
  | typeof ANALYSIS_OPTIONS.BIAS.RISK.value;

/**
 * Categorizes error messages based on content patterns
 *
 * @param errorMessage - The error message to categorize
 * @returns The appropriate error category and user-friendly message
 */
export function categorizeAnalysisError(errorMessage: string): string {
  const message = errorMessage.toLowerCase();

  if (
    ERROR_PATTERNS.SERVICE_UNAVAILABLE.some((pattern) =>
      message.includes(pattern.toLowerCase())
    )
  ) {
    return ANALYSIS_ERROR_MESSAGES.SERVICE_UNAVAILABLE;
  }

  if (
    ERROR_PATTERNS.RATE_LIMITED.some((pattern) =>
      message.includes(pattern.toLowerCase())
    )
  ) {
    return ANALYSIS_ERROR_MESSAGES.RATE_LIMITED;
  }

  if (
    ERROR_PATTERNS.CONNECTION.some((pattern) =>
      message.includes(pattern.toLowerCase())
    )
  ) {
    return ANALYSIS_ERROR_MESSAGES.CONNECTION_ERROR;
  }

  if (
    ERROR_PATTERNS.TIMEOUT.some((pattern) =>
      message.includes(pattern.toLowerCase())
    )
  ) {
    return ANALYSIS_ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  return `${ANALYSIS_ERROR_MESSAGES.GENERIC_ERROR}: ${errorMessage}`;
}
