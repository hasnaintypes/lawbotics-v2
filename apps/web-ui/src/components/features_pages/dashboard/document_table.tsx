"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DocumentTableEntry {
  id: string
  title: string
  type: string
  date: string
  status: string
  risk_score: string
  author: string
  last_modified: string
}

interface DocumentTableProps {
  documents: DocumentTableEntry[]
}

type SortField = keyof DocumentTableEntry
type SortDirection = "asc" | "desc" | null

export function DocumentTable({ documents }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedDocuments = [...documents].sort((a, b) => {
    if (!sortField || !sortDirection) return 0

    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle date sorting
    if (sortField === "date" || sortField === "last_modified") {
      aValue = new Date(aValue).getTime().toString()
      bValue = new Date(bValue).getTime().toString()
    }

    // Handle risk score sorting
    if (sortField === "risk_score") {
      const aNum = Number.parseInt(aValue) || 0
      const bNum = Number.parseInt(bValue) || 0
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum
    }

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Document
                {getSortIcon("title")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("type")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Type
                {getSortIcon("type")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Date
                {getSortIcon("date")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("risk_score")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Risk Score
                {getSortIcon("risk_score")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("author")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Author
                {getSortIcon("author")}
              </Button>
            </TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDocuments.map((doc) => (
            <TableRow key={doc.id} className="group">
              <TableCell className="font-medium">
                <div className="max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">
                  <div className="font-semibold truncate">{doc.title}</div>
                  <div className="md:hidden text-xs text-muted-foreground mt-1">
                    {doc.type} • {doc.date}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline" className="text-xs">
                  {doc.type}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">{doc.date}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(doc.status)} className="text-xs">
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getRiskColor(doc.risk_score)} className="text-xs">
                  {doc.risk_score}
                  {doc.risk_score !== "N/A" && !isNaN(Number.parseInt(doc.risk_score)) ? "%" : ""} Risk
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">{doc.author}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Document</DropdownMenuItem>
                    <DropdownMenuItem>Analyze</DropdownMenuItem>
                    <DropdownMenuItem>Chat with Document</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
