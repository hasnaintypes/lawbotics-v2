"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, FileText, Flag, Scale } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useAnalysisStore } from "@/store/analysis.store"

interface AnalysisOptionsDialogProps {
  isOpen: boolean
  onClose: () => void
  documentId: Id<"documents">
}

export function AnalysisOptionsDialog({ isOpen, onClose, documentId }: AnalysisOptionsDialogProps) {
  const router = useRouter()
  const [party, setParty] = useState<string>("")
  const [customParty, setCustomParty] = useState<string>("")
  const [depth, setDepth] = useState<"summary" | "full">("full")
  const [bias, setBias] = useState<"neutral" | "favorable" | "risk">("neutral")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Fetch extracted parties from Convex
  const parties = useQuery(api.extractedParties.getExtractedParties, {  documentId}) || []

  // Analyze document mutation
  const analyzeDocument = useAction(api.actions.analyzeDocument.analyzeDocument)

  // Set default party to "neutral"
  useEffect(() => {
    if (!party) {
      setParty("neutral")
    }
  }, [party])

  const addOrUpdateAnalysis = useAnalysisStore((state) => state.addOrUpdateAnalysis)

  const handleSubmit = async () => {
    setIsAnalyzing(true)

    try {
      // Get the selected party (either from dropdown or custom input)
      const selectedParty = party === "other" ? customParty : party

      // Call the analyze document action
      const result = await analyzeDocument({
        documentId,
        partyPerspective: selectedParty,
        analysisDepth: depth,
        analysisBias: bias,
      })

      console.log("Analysis result:", result)

      if (result.success) {
        if (result.analysis) {
          addOrUpdateAnalysis(result.analysis)
        }
        // Navigate to the analysis page
        router.push(`/analysis/${documentId}`)
      } else {
        console.error("Analysis failed:", result.error)
        // Handle error (could show a toast notification)
      }
    } catch (error) {
      console.error("Error analyzing document:", error)
    } finally {
      setIsAnalyzing(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configure Analysis Options
          </DialogTitle>
          <DialogDescription>Customize how you want this document to be analyzed.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="party">Analysis Perspective</Label>
            <Select value={party} onValueChange={setParty}>
              <SelectTrigger id="party">
                <SelectValue placeholder="Select perspective" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="neutral">Neutral (Balanced Analysis)</SelectItem>
                  {parties.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other (specify)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {party === "other" && (
              <Input
                id="customParty"
                placeholder="Enter perspective name"
                value={customParty}
                onChange={(e) => setCustomParty(e.target.value)}
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="depth">Preferred analysis depth</Label>
            <Select value={depth} onValueChange={(value) => setDepth(value as "summary" | "full")}>
              <SelectTrigger id="depth">
                <SelectValue placeholder="Select analysis depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Short summary</SelectItem>
                <SelectItem value="full">Full analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Analysis perspective</Label>
            <RadioGroup
              value={bias}
              onValueChange={(value) => setBias(value as "neutral" | "favorable" | "risk")}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral" className="flex flex-1 items-center gap-2 font-normal">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>Neutral</p>
                    <p className="text-xs text-muted-foreground">Balanced analysis without bias</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                <RadioGroupItem value="favorable" id="favorable" />
                <Label htmlFor="favorable" className="flex flex-1 items-center gap-2 font-normal">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>In favor of selected party</p>
                    <p className="text-xs text-muted-foreground">Highlight advantages for your side</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                <RadioGroupItem value="risk" id="risk" />
                <Label htmlFor="risk" className="flex flex-1 items-center gap-2 font-normal">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>Flag risky clauses</p>
                    <p className="text-xs text-muted-foreground">Focus on potential risks and issues</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isAnalyzing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isAnalyzing || (!party && !customParty)}>
            {isAnalyzing ? "Analyzing..." : "Start Analysis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
