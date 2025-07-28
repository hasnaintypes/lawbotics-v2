"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractBasicInfo } from "./contract-basic-info";
import { ContractPartiesSection } from "./contract-parties-section";
import { ContractClausesSection } from "./contract-clauses-section";
import { ContractTermsSection } from "./contract-terms-section";
import { ContractPreview } from "./preview/contract-preview";
import { Button } from "@/components/ui/button";
import { Save, Eye, Send, ArrowLeft } from "lucide-react";
import { useContractCreation } from "@/hooks";
import { usePersistentContractForm } from "@/hooks/use-persistent-contract-form";
import {
  getContractTemplate,
  getContractTypeDisplayName,
} from "@/constants/contract-templates";
import { useRouter } from "next/navigation";

/**
 * Main contract creation form component with template support
 * Handles both custom contracts and template-based contracts
 * @returns {JSX.Element} Contract creation form
 */
export function ContractCreationForm() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const { formData, updateFormData, saveContract, isLoading } =
    useContractCreation();
  // Persist form data in localStorage
  const { clearStoredForm } = usePersistentContractForm(
    formData,
    updateFormData
  );

  // Load template data if templateId is provided
  useEffect(() => {
    if (templateId) {
      const template = getContractTemplate(templateId);
      if (template) {
        // Pre-populate form with template data
        updateFormData({
          type: template.type,
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          description: template.description,
          clauses:
            template.preDefinedClauses?.map((clause: any) => ({
              id: clause.id,
              title: clause.title,
              content: clause.content,
              order: clause.order,
            })) || [],
        });
      }
    }
  }, [templateId, updateFormData]);

  /**
   * Gets the page title based on contract type
   */
  const getPageTitle = () => {
    if (templateId) {
      return `Create ${getContractTypeDisplayName(formData.type)}`;
    }
    return "Create Custom Contract";
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    await saveContract();
    clearStoredForm();
  };

  /**
   * Handles preview toggle
   */
  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Contract Preview
          </h2>
          <Button
            onClick={handlePreview}
            variant="outline"
            className="rounded-xl bg-transparent w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            Edit Contract
          </Button>
        </div>
        <ContractPreview formData={formData} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {getPageTitle()}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {templateId
            ? "Using template with pre-defined clauses"
            : "Build a custom contract with detailed clauses and terms"}
        </p>
      </div>

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
            <ContractPartiesSection
              formData={formData}
              onUpdate={updateFormData}
            />
          </CardContent>
        </Card>

        {/* Contract Clauses */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              Contract Clauses
              {templateId && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Pre-loaded from template
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractClausesSection
              formData={formData}
              onUpdate={updateFormData}
            />
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
            <ContractTermsSection
              formData={formData}
              onUpdate={updateFormData}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <Button
          onClick={handlePreview}
          variant="outline"
          className="rounded-xl bg-transparent w-full sm:w-auto"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Contract
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={handleSubmit}
            variant="outline"
            disabled={isLoading}
            className="rounded-xl bg-transparent"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-xl"
          >
            <Send className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
        </div>
      </div>
    </div>
  );
}
