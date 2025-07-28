"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Upload,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "../../../../../convex/_generated/dataModel";
import React from "react";
import { LoadingSpinner } from "@/components/shared";

/**
 * Document View Page Component
 *
 * Displays detailed information about a specific document including:
 * - Document metadata and status
 * - Content preview
 * - File information and download options
 * - Analysis capabilities
 */

export default function DocumentViewPage() {
  // State for content preview expansion (must be first hook)
  const [showFullContent, setShowFullContent] = React.useState(false);

  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as Id<"documents">;

  const document = useQuery(api.documents.getDocument, {
    documentId,
  });

  /**
   * Get appropriate icon based on file type
   */
  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return File;
    if (type.includes("image")) return FileImage;
    if (type.includes("spreadsheet") || type.includes("excel"))
      return FileSpreadsheet;
    if (type.includes("code")) return FileCode;
    return FileText;
  };

  /**
   * Get status configuration including color and icon
   */
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          label: "Completed",
        };
      case "processing":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Loader2,
          label: "Processing",
        };
      case "failed":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          label: "Failed",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Clock,
          label: "Unknown",
        };
    }
  };

  /**
   * Format file size in human readable format
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  /**
   * Format date in a user-friendly format
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (document === undefined) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner
          title="Loading Document"
          description="Please wait while we fetch your document details..."
          size="lg"
        />
      </div>
    );
  }

  // Document not found state
  if (document === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center space-y-6">
            <FileText className="h-20 w-20 text-red-400 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">
                Document Not Found
              </h2>
              <p className="text-slate-600 max-w-md">
                The document you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const FileIcon = getFileIcon(document.fileType);
  const statusConfig = getStatusConfig(document.status);
  const StatusIcon = statusConfig.icon;

  // Helper function to get short title for display
  const getShortTitle = (title: string) =>
    title.length > 40 ? title.slice(0, 37) + "..." : title;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Full-width Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-6">
            {/* Left section - Back button and document info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 shrink-0"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileIcon className="h-6 w-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 truncate">
                      {getShortTitle(document.title)}
                    </h1>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        {formatFileSize(document.fileSize)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(document.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    className={`${statusConfig.color} flex items-center gap-2`}
                  >
                    <StatusIcon
                      className={`h-3 w-3 ${document.status === "processing" ? "animate-spin" : ""}`}
                    />
                    <span className="mr-2">{statusConfig.label}</span>
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {document.fileType.split("/")[1]?.toUpperCase() ||
                      "DOCUMENT"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right section - Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => router.push(`/analysis/${documentId}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Analyze Document
              </Button>
              {document.fileUrl && (
                <Button
                  onClick={() => window.open(document.fileUrl, "_blank")}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Document Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Information */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Document Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      File Name
                    </label>
                    <p className="text-sm font-medium text-slate-900">
                      {getShortTitle(document.title)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      File Type
                    </label>
                    <p className="text-sm font-medium text-slate-900">
                      {document.fileType}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      File Size
                    </label>
                    <p className="text-sm font-medium text-slate-900">
                      {formatFileSize(document.fileSize)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusConfig.color} w-fit`}>
                        <StatusIcon
                          className={`h-3 w-3 mr-1 ${document.status === "processing" ? "animate-spin" : ""}`}
                        />
                        <span className="mr-2">{statusConfig.label}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Created
                    </label>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(document.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Last Updated
                    </label>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(document.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Preview */}
            {document.content && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Content Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                        {showFullContent
                          ? document.content
                          : document.content.substring(0, 1500)}
                        {document.content.length > 1500 &&
                          !showFullContent &&
                          "..."}
                      </pre>
                    </div>
                    {document.content.length > 1500 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {showFullContent
                            ? `Showing full content (${document.content.length.toLocaleString()} characters).`
                            : "Showing first 1,500 characters. Download the full document to view all content."}
                        </p>
                        <button
                          className="ml-4 text-xs text-blue-600 hover:underline font-medium"
                          onClick={() => setShowFullContent((v) => !v)}
                        >
                          {showFullContent ? "Show Less" : "Show More"}
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - File Preview & Actions */}
          <div className="space-y-6">
            {/* File Preview Card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  File Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <FileIcon className="h-10 w-10 text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-900 text-sm">
                      {document.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <span>
                        {document.fileType.split("/")[1]?.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(document.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex  items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Words</span>
                  <span className="text-sm font-medium text-slate-900">
                    {document.content
                      ? document.content.trim().length === 0
                        ? 0
                        : document.content
                            .trim()
                            .split(/\s+/)
                            .length.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Characters</span>
                  <span className="text-sm font-medium text-slate-900">
                    {document.content
                      ? document.content.length.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Pages (est.)</span>
                  <span className="text-sm font-medium text-slate-900">
                    {document.content
                      ? Math.ceil(document.content.length / 2000)
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      Document processed
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(document.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      Document uploaded
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(document.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
