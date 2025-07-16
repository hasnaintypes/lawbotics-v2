"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  User,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function DocumentViewPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as Id<"documents">;

  // Get the document details
  const document = useQuery(api.documents.getDocument, {
    documentId,
  });

  if (document === undefined) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 text-primary mx-auto animate-spin">
            <FileText className="h-full w-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Loading Document...</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch your document.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-bold">Document Not Found</h2>
            <p className="text-muted-foreground">
              The document with ID "{documentId}" could not be found.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-4xl">
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
                {document.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className={getStatusColor(document.status)}
                >
                  {document.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {document.fileType}
                </span>
                <span className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  {formatFileSize(document.fileSize || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/analysis/${documentId}`)}
                variant="default"
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

        {/* Document Details */}
        <div className="grid gap-6">
          {/* Document Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    File Name
                  </label>
                  <p className="font-medium">{document.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    File Type
                  </label>
                  <p className="font-medium">{document.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    File Size
                  </label>
                  <p className="font-medium">
                    {formatFileSize(document.fileSize || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="font-medium">
                    {new Date(document.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="font-medium">
                    {new Date(document.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Content Preview */}
          {document.content && (
            <Card>
              <CardHeader>
                <CardTitle>Document Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words text-muted-foreground">
                    {document.content.substring(0, 2000)}
                    {document.content.length > 2000 && "..."}
                  </pre>
                </div>
                {document.content.length > 2000 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing first 2000 characters. Download the full document to
                    see all content.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* File Preview */}
          {document.fileUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Document File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">{document.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {document.fileType} •{" "}
                    {formatFileSize(document.fileSize || 0)}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => window.open(document.fileUrl, "_blank")}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                    <Button
                      onClick={() => router.push(`/analysis/${documentId}`)}
                    >
                      Analyze Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
