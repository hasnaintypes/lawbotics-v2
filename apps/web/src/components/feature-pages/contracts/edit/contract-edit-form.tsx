"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ContractBasicInfo } from "../contract-basic-info"
import { ContractPartiesSection } from "../contract-parties-section"
import { ContractClausesSection } from "../contract-clauses-section"
import { ContractTermsSection } from "../contract-terms-section"
import { useContractEdit } from "@/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface ContractEditFormProps {
  /** Contract ID to edit */
  contractId: string
}

/**
 * Contract edit form component with version control
 * @param {ContractEditFormProps} props - Component props
 * @returns {JSX.Element} Contract edit form
 */
export function ContractEditForm({ contractId }: ContractEditFormProps) {
  const router = useRouter()
 
  const { formData, isLoading, error, updateFormData, saveContract, hasChanges } = useContractEdit(contractId as any)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Handles navigation back to contract view
   */
  const handleBack = () => {
    router.push(`/contracts`)
  }

  /**
   * Handles form submission and version creation
   */
  const handleSave = async () => {
    setIsSaving(true)
    const success = await saveContract()
    if (success) {
      router.push(`/contracts/${contractId}`)
    }
    setIsSaving(false)
  }

  /**
   * Handles preview navigation
   */
  const handlePreview = () => {
    router.push(`/contracts/${contractId}`)
  }

  if (isLoading) {
    return <ContractEditSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert className="rounded-2xl border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} variant="outline" className="rounded-xl bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Contract not found</p>
        <Button onClick={handleBack} className="mt-4 rounded-xl">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={handleBack} variant="ghost" className="gap-2 rounded-xl w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Contract
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Contract</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Editing will create a new version: v{formData.nextVersion}
            </p>
          </div>
        </div>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert className="rounded-2xl border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You have unsaved changes. Saving will create version {formData.nextVersion} of this contract.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Sections */}
      <div className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractBasicInfo formData={formData} onUpdate={updateFormData} />
          </CardContent>
        </Card>

        {/* Contract Parties */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Contract Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractPartiesSection formData={formData} onUpdate={updateFormData} />
          </CardContent>
        </Card>

        {/* Contract Clauses */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Contract Clauses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractClausesSection formData={formData} onUpdate={updateFormData} />
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <ContractTermsSection formData={formData} onUpdate={updateFormData} />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <Button onClick={handlePreview} variant="outline" className="rounded-xl w-full sm:w-auto bg-transparent">
          <Eye className="h-4 w-4 mr-2" />
          Preview Changes
        </Button>

        <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="rounded-xl w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : `Save as v${formData.nextVersion}`}
        </Button>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for contract edit form
 * @returns {JSX.Element} Skeleton component
 */
function ContractEditSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
