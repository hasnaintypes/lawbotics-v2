/**
 * Utility functions for consistent date formatting across server and client
 * to prevent hydration mismatches in Next.js applications.
 */

/**
 * Formats a timestamp into a consistent date string that works identically
 * on both server and client to prevent hydration mismatches.
 *
 * @param timestamp - Unix timestamp or Date-compatible number
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateConsistent(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a timestamp into a user-friendly date string that's still
 * consistent across server and client environments.
 *
 * @param timestamp - Unix timestamp or Date-compatible number
 * @returns Formatted date string in "MMM DD, YYYY" format
 */
export function formatDateFriendly(timestamp: number): string {
  const date = new Date(timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Formats a timestamp for display in data tables and cards.
 * Uses a format that's readable but consistent across environments.
 *
 * @param timestamp - Unix timestamp or Date-compatible number
 * @returns Formatted date string
 */
export function formatDateForDisplay(timestamp: number): string {
  return formatDateFriendly(timestamp);
}

/**
 * Formats a date string or Date object to a readable format
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date: string | number | Date): string {
  let dateObj: Date;
  if (typeof date === "number") {
    dateObj = new Date(date);
  } else if (typeof date === "string") {
    // Try to parse as number first (timestamp as string), else as date string
    const maybeNum = Number(date);
    if (!isNaN(maybeNum)) {
      dateObj = new Date(maybeNum);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  if (typeof dateObj.toLocaleDateString === "function") {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  // fallback
  return String(date);
}

/**
 * Formats a date to relative time (e.g., "2 days ago")
 * @param {string | Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
}

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};
