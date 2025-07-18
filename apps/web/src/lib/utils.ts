import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ContractStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to calculate the dot product of two numeric arrays.
 * @param {number[]} a - First array of numbers.
 * @param {number[]} b - Second array of numbers.
 * @returns {number} The dot product of the two arrays.
 */
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Cleans the AI response text by removing Markdown code block markers if present.
 * Handles both ```json and ``` markers at the start and end of the string.
 * @param {string} text - The raw AI response text.
 * @returns {string} The cleaned text, ready for JSON parsing.
 */
export function cleanAIResponseText(text: string): string {
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.replace(/^```json[\r\n]*/i, "");
  }
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[\r\n]*/i, "");
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.replace(/```\s*$/i, "");
  }
  return cleanText;
}

/**
 * Gets the appropriate badge variant for a contract status
 * @param {ContractStatus | string} status - Contract status
 * @returns {string} Badge variant class
 */
export function getStatusVariant(
  status: ContractStatus | string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "active":
      return "default";
    case "draft":
      return "secondary";
    case "expired":
    case "terminated":
      return "destructive";
    case "pending":
    case "under_review":
    case "pending_approval":
      return "outline";
    case "approved":
      return "default";
    default:
      return "secondary";
  }
}

/**
 * Gets human-readable status text
 * @param {ContractStatus | string} status - Contract status
 * @returns {string} Formatted status text
 */
export function getStatusText(status: ContractStatus | string): string {
  switch (status.toLowerCase()) {
    case "under_review":
      return "Under Review";
    case "pending_approval":
      return "Pending Approval";
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "expired":
      return "Expired";
    case "terminated":
      return "Terminated";
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "archived":
      return "Archived";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
