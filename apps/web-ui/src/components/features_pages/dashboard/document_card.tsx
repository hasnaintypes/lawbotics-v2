"use client"
import { MoreHorizontal, Calendar, User, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAnalysisStore } from "@/store/analysis.store";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentCardProps {
  id: string
  title: string
  type: string
  date: string
  status: string
  risk_score: string
  last_modified: string
  author: string
  description?: string
}

export function DocumentCard({
  id,
  title,
  type,
  date,
  status,
  risk_score,
  last_modified,
  author,
}: DocumentCardProps) {
  const router = useRouter();
  const convex = useConvex();
  const addOrUpdateAnalysis = useAnalysisStore((state) => state.addOrUpdateAnalysis);

  const getRiskColor = (score: string) => {
    if (score === "High" || (Number.parseInt(score) >= 75 && score !== "N/A")) {
      return "destructive"
    }
    if (score === "Medium" || (Number.parseInt(score) >= 40 && score !== "N/A")) {
      return "outline"
    }
    return "secondary"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Flagged":
        return "destructive"
      case "Pending Review":
        return "outline"
      case "Approved":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleAnalyze = async () => {
    try {
      // Fetch the latest analysis for this document
      const analysis = await convex.query(api.analyses.getLatestAnalysisForDocument, { documentId: id as Id<"documents"> });
      if (analysis) {
        addOrUpdateAnalysis(analysis);
      }
      router.push(`/analysis/${id}`);
    } catch (err) {
      // Optionally handle error (e.g., show toast)
      router.push(`/analysis/${id}`); // fallback navigation
    }
  };

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
              <span className="font-medium">{type}</span>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {date}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleAnalyze}>Analyze</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusColor(status)} className="text-xs">
            {status}
          </Badge>
          <Badge variant={getRiskColor(risk_score)} className="text-xs flex items-center gap-1">
            {(risk_score === "High" || Number.parseInt(risk_score) >= 75) && <AlertTriangle className="h-3 w-3" />}
            {risk_score}
            {risk_score !== "N/A" && !isNaN(Number.parseInt(risk_score)) ? "%" : ""} Risk
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex w-full justify-between items-center">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {author}
          </span>
          <span>Modified {last_modified}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
