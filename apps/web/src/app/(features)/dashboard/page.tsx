"use client";

import * as React from "react";
import { Grid3X3, List, Search, Upload, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TopNavigation } from "@/components/layout";
import {
  AnalyticsCard,
  Charts,
  DocumentCard,
  DocumentTable,
  UploadDialog,
  PostUploadDialog,
  SyncUserOnLoad
} from "@/components/feature-pages/dashboard";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { useAnalysisStore } from "@/store/analysis.store";
import {
  usePagination,
  calculateTotalPages,
  useDashboardAnalytics,
  useFormattedUser,
  useUnifiedDocuments,
} from "@/hooks";

import type { DocumentEntry } from "@/lib";
import { formatDateForDisplay } from "@/lib";
import { LoadingSpinner } from "@/components/shared";
import type { Id } from "../../../../convex/_generated/dataModel";

const ITEMS_PER_PAGE = 6;

/**
 * Dashboard Page Component
 *
 * Main dashboard interface for the legal AI application. Features include:
 * - Real-time analytics cards showing document metrics and risk assessments
 * - Document management with grid/list view modes and search functionality
 * - Upload and analysis capabilities for legal documents
 * - Paginated document display with filtering options
 *
 * This component has been refactored to use several custom hooks for better
 * code organization and reusability:
 * - `useDashboardAnalytics`: Handles analytics calculations and formatting
 * - `usePagination`: Manages pagination logic and state
 * - `useFormattedUser`: Provides clean user data formatting
 * - `useAnalysisStore`: Manages analysis data state
 *
 * All inline calculations have been extracted to dedicated hooks following
 * JSDoc documentation standards for improved maintainability.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [postUploadDialogOpen, setPostUploadDialogOpen] = React.useState(false);
  const [postUploadDocumentId, setPostUploadDocumentId] =
    React.useState<Id<"documents"> | null>(null);
  const [uploadedFileName, setUploadedFileName] = React.useState<string>("");

  const { user } = useUser();
  const convex = useConvex();
  const { analyses, isLoading, error, fetchAnalyses } = useAnalysisStore();
  const userInfo = useFormattedUser();

  // Use unified documents hook to get both analyzed and unanalyzed documents
  const {
    documents: unifiedDocuments,
    isLoading: documentsLoading,
    error: documentsError,
  } = useUnifiedDocuments(user?.id);

  // Calculate analytics using custom hook
  const {
    metrics,
    analyticsCards,
    isLoading: analyticsLoading,
  } = useDashboardAnalytics();

  // Fetch analyses when user is available
  React.useEffect(() => {
    if (user?.id) {
      fetchAnalyses(convex, user.id);
    }
  }, [user?.id, fetchAnalyses, convex]);

  // Filter documents based on search query
  const filteredDocuments = React.useMemo((): DocumentEntry[] => {
    if (!searchQuery) return unifiedDocuments;

    return unifiedDocuments.filter(
      (doc: DocumentEntry) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, unifiedDocuments]);

  // Use pagination hook for cleaner pagination logic
  const { pagination, data } = usePagination<DocumentEntry>(
    filteredDocuments,
    ITEMS_PER_PAGE,
    {
      currentPage,
      totalPages: calculateTotalPages(filteredDocuments.length, ITEMS_PER_PAGE),
    }
  );

  // Get properly typed current documents for components
  const currentDocuments = data.currentItems as DocumentEntry[];

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSignOut = () => {
    // Implement sign out logic
    console.log("Sign out clicked");
  };

  const handleUploadComplete = (documentId: string, fileName?: string) => {
    console.log("Document uploaded:", documentId);
    setPostUploadDocumentId(documentId as Id<"documents">);
    setUploadedFileName(fileName || "");
    setPostUploadDialogOpen(true);
    setUploadDialogOpen(false);
    if (user?.id) {
      fetchAnalyses(convex, user.id);
    }
  };

  const handleCreateContract = () => {
    // Navigate to contract creation page
    router.push("/contracts");
  };

  // Render pagination items using the pagination hook
  const renderPaginationItems = () => {
    return pagination.visiblePages.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(page);
            }}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  // Show enhanced loading state while data is being fetched
  if (isLoading || analyticsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TopNavigation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner
            title="Loading Dashboard"
            description="Fetching your legal documents"
            subtitle="Please wait while we analyze your documents and prepare your analytics dashboard."
            size="md"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavigation
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 container py-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {userInfo.firstName}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your legal documents today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="gap-2 rounded-xl"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button
              onClick={handleCreateContract}
              variant="outline"
              className="gap-2 rounded-xl"
            >
              <FileText className="h-4 w-4" />
              Create Contract
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analyticsCards.map((card, index) => (
            <AnalyticsCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              iconColor={card.iconColor}
              trend={card.trend}
              description={card.description}
              badge={card.badge}
            />
          ))}
        </section>

        {/* Charts Section */}
        <section className="space-y-6">
          {/* Two Charts in One Line */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Charts type="weekly_activity" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Charts type="risk_distribution" />
              </CardContent>
            </Card>
          </div>

          {/* Big Rectangle Chart Below */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Monthly Document Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Breakdown of document types processed each month
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Charts type="monthly_analysis" />
            </CardContent>
          </Card>
        </section>

        {/* Documents Section */}
        <section>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 p-6">
              <div>
                <CardTitle className="text-xl">Documents</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredDocuments.length} documents found
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Search */}
                <div className="flex sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40 pl-8"
                    />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-7 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-7 px-2"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              {viewMode === "list" ? (
                <div className="space-y-4">
                  <DocumentTable
                    documents={currentDocuments}
                    showingAnalyses={false}
                  />
                  {pagination.showPrevious && (
                    <div className="flex justify-center pt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!pagination.isPreviousDisabled)
                                  setCurrentPage(currentPage - 1);
                              }}
                              className={
                                pagination.isPreviousDisabled
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {renderPaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!pagination.isNextDisabled)
                                  setCurrentPage(currentPage + 1);
                              }}
                              className={
                                pagination.isNextDisabled
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        documentId={doc.documentId}
                        title={doc.title}
                        type={doc.type}
                        date={doc.date}
                        status={doc.status}
                        risk_score={doc.risk_score}
                        last_modified={doc.last_modified}
                        author={doc.author}
                        description={doc.description}
                        showingAnalyses={false}
                        hasAnalysis={doc.hasAnalysis}
                        analysisId={doc.analysisId}
                        analysisStatus={doc.analysisStatus}
                        isAnalyzed={doc.isAnalyzed}
                      />
                    ))}
                  </div>
                  {pagination.showNext && (
                    <div className="flex justify-center pt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!pagination.isPreviousDisabled)
                                  setCurrentPage(currentPage - 1);
                              }}
                              className={
                                pagination.isPreviousDisabled
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {renderPaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!pagination.isNextDisabled)
                                  setCurrentPage(currentPage + 1);
                              }}
                              className={
                                pagination.isNextDisabled
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              )}

              {filteredDocuments.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No documents found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No documents match "${searchQuery}"`
                      : "Upload your first document to get started"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => setUploadDialogOpen(true)}
                      variant="outline"
                      className="gap-2 rounded-xl"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Document
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />

      {/* Post Upload Dialog */}
      {postUploadDocumentId && (
        <PostUploadDialog
          open={postUploadDialogOpen}
          onOpenChange={setPostUploadDialogOpen}
          fileName={uploadedFileName}
          documentId={postUploadDocumentId}
        />
      )}
    </div>
  );
}
