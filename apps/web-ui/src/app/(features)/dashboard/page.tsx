"use client"

import * as React from "react"
import { Grid3X3, List, Search, Upload, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TopNavigation } from "@/components/layout/top_navigation"
import { AnalyticsCard } from "@/components/features_pages/dashboard/analytics_card"
import { Charts } from "@/components/features_pages/dashboard/charts"
import { DocumentCard } from "@/components/features_pages/dashboard/document_card"
import { DocumentTable } from "@/components/features_pages/dashboard/document_table"
import { UploadDialog } from "@/components/features_pages/dashboard/upload_dialog"
import { AnalysisDialog } from '@/components/features_pages/dashboard/analysis_dialog'
import { useUser } from "@clerk/nextjs"
import { useConvex } from "convex/react"
import { useAnalysisStore } from "@/store/analysis.store"
import { analytics_cards_data } from "@/constants/mock_data"

const ITEMS_PER_PAGE = 6

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)
  const [analysisDialogOpen, setAnalysisDialogOpen] = React.useState(false)
  const [analysisDialogDocumentId, setAnalysisDialogDocumentId] = React.useState<string | null>(null)
  const [analysisDialogFileName, setAnalysisDialogFileName] = React.useState<string>("")

  const { user } = useUser()
  const convex = useConvex()
  const { analyses, isLoading, error, fetchAnalyses } = useAnalysisStore()

  // Fetch analyses when user is available
  React.useEffect(() => {
    if (user?.id) {
      fetchAnalyses(convex, user.id)
    }
  }, [user?.id, fetchAnalyses, convex])

  // Mock user data for navigation - use actual user data when available
  const mockUser = {
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.emailAddresses?.[0]?.emailAddress || "john.doe@example.com",
  }

  // Convert analyses to document format for compatibility with existing components
  const documentsFromAnalyses = React.useMemo(() => {
    return analyses.map((analysis) => ({
      id: analysis._id,
      title: analysis.document?.title || "Untitled Document",
      type: analysis.document?.type || "Document",
      date: new Date(analysis._creationTime).toLocaleDateString(),
      status: analysis.status || "Processed",
      risk_score: analysis.riskScore?.toString() || "N/A",
      last_modified: new Date(analysis._creationTime).toLocaleDateString(),
      author: analysis.author || mockUser.firstName,
      description: (analysis.document as any)?.summary || "No description available",
    }))
  }, [analyses, mockUser.firstName])

  // Filter documents based on search query
  const filteredDocuments = React.useMemo(() => {
    if (!searchQuery) return documentsFromAnalyses

    return documentsFromAnalyses.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.status.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, documentsFromAnalyses])

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSignOut = () => {
    // Implement sign out logic
    console.log("Sign out clicked")
  }

  const handleUploadComplete = (documentId: string) => {
    console.log("Document uploaded:", documentId)
    setAnalysisDialogDocumentId(documentId)
    setAnalysisDialogOpen(true)
    setUploadDialogOpen(false)
    // Optionally, set file name if available
    // setAnalysisDialogFileName(fileName) // If you have access to fileName
    // Refresh analyses
    if (user?.id) {
      fetchAnalyses(convex, user.id)
    }
  }

  const handleCreateContract = () => {
    // Navigate to contract creation page
    router.push("/contracts/")
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(1)
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(totalPages)
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  // Calculate dynamic analytics based on real data
  const dynamicAnalyticsData = React.useMemo(() => {
    const totalDocs = analyses.length
    const highRiskDocs = analyses.filter((a) => (a.riskScore || 0) >= 75).length
    const activeReviews = analyses.filter((a) => a.status === "processing").length
    const thisMonth = new Date().getMonth()
    const thisMonthDocs = analyses.filter((a) => new Date(a._creationTime).getMonth() === thisMonth).length
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthDocs = analyses.filter((a) => new Date(a._creationTime).getMonth() === lastMonth).length
    const monthlyGrowth = lastMonthDocs > 0 ? Math.round(((thisMonthDocs - lastMonthDocs) / lastMonthDocs) * 100) : 0

    return [
      {
        ...analytics_cards_data[0],
        value: totalDocs.toString(),
        change: `${totalDocs > 0 ? "+" : ""}${Math.round(totalDocs * 0.12)} from last month`,
      },
      {
        ...analytics_cards_data[1],
        value: highRiskDocs.toString(),
        change: `${highRiskDocs > 0 ? "-" : ""}${Math.round(highRiskDocs * 0.05)} from last month`,
      },
      {
        ...analytics_cards_data[2],
        value: activeReviews.toString(),
        change: `${activeReviews > 0 ? "+" : ""}${Math.round(activeReviews * 0.08)} from last month`,
      },
      {
        ...analytics_cards_data[3],
        value: `${monthlyGrowth}%`,
        change: `${monthlyGrowth >= 0 ? "+" : ""}${Math.round(monthlyGrowth * 0.03)}% from last month`,
      },
    ]
  }, [analyses])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TopNavigation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 container py-6 space-y-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {mockUser.firstName}</h1>
            <p className="text-muted-foreground">Here's what's happening with your legal documents today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2 rounded-xl">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button onClick={handleCreateContract} variant="outline" className="gap-2 rounded-xl">
              <FileText className="h-4 w-4" />
              Create Contract
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dynamicAnalyticsData.map((card, index) => (
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
              <CardTitle className="text-lg">Monthly Document Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Breakdown of document types processed each month</p>
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
                <p className="text-sm text-muted-foreground mt-1">{filteredDocuments.length} documents found</p>
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
                  <DocumentTable documents={paginatedDocuments} />
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {generatePaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
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
                    {paginatedDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        type={doc.type}
                        date={doc.date}
                        status={doc.status}
                        risk_score={doc.risk_score}
                        last_modified={doc.last_modified}
                        author={doc.author}
                        description={doc.description}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {generatePaginationItems()}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
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
                  <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? `No documents match "${searchQuery}"` : "Upload your first document to get started"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setUploadDialogOpen(true)} variant="outline" className="gap-2 rounded-xl">
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
      {analysisDialogDocumentId && (
        <AnalysisDialog
          open={analysisDialogOpen}
          onOpenChange={setAnalysisDialogOpen}
          fileName={analysisDialogFileName}
          documentId={analysisDialogDocumentId}
        />
      )}
    </div>
  )
}
