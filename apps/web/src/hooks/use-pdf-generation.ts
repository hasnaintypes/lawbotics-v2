"use client";

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Custom hook for PDF generation and download with comprehensive error handling
 * @returns {Object} PDF operations
 */
export function usePdfGeneration() {
  const getPdfData = useAction(api.actions.pdfGeneration.getContractPdfData);

  // Helper to generate PDF using jsPDF
  const generatePdf = (data: any) => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.text(data.contract.name, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Version: ${data.contract.version || "1.0"}`, 10, y);
    y += 8;
    if (data.contract.status) {
      doc.text(`Status: ${data.contract.status}`, 10, y);
      y += 8;
    }
    if (data.contract.description) {
      doc.text(`Description: ${data.contract.description}`, 10, y);
      y += 8;
    }
    if (data.contract.type) {
      doc.text(`Type: ${data.contract.type}`, 10, y);
      y += 8;
    }
    if (data.contract.value) {
      doc.text(
        `Value: ${data.contract.currency || "USD"} ${data.contract.value}`,
        10,
        y
      );
      y += 8;
    }
    if (data.contract.startDate) {
      doc.text(
        `Start Date: ${new Date(data.contract.startDate).toLocaleDateString()}`,
        10,
        y
      );
      y += 8;
    }
    if (data.contract.endDate) {
      doc.text(
        `End Date: ${new Date(data.contract.endDate).toLocaleDateString()}`,
        10,
        y
      );
      y += 8;
    }
    y += 4;
    doc.setFontSize(14);
    doc.text("Parties:", 10, y);
    y += 8;
    doc.setFontSize(12);
    if (data.parties && data.parties.length > 0) {
      data.parties.forEach((party: any) => {
        doc.text(`- ${party.name} (${party.type}, ${party.role})`, 12, y);
        y += 7;
      });
    } else {
      doc.text("No parties listed.", 12, y);
      y += 7;
    }
    y += 4;
    doc.setFontSize(14);
    doc.text("Terms:", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(data.contract.content || "No content.", 12, y, { maxWidth: 180 });
    y += 30;
    if (data.includeSignatures && data.parties && data.parties.length > 0) {
      doc.setFontSize(14);
      doc.text("Signatures:", 10, y);
      y += 8;
      doc.setFontSize(12);
      data.parties.forEach((party: any) => {
        doc.text(`${party.name}: ______________________`, 12, y);
        y += 8;
      });
    }
    if (data.watermark) {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(48);
      doc.text(data.watermark, 60, 150, { angle: 30 });
      doc.setTextColor(0, 0, 0);
    }
    return doc;
  };

  /**
   * Generates and downloads a contract PDF with detailed error handling
   * @param {Id<"contracts">} contractId - Contract ID
   * @param {Object} options - PDF options
   * @returns {Promise<boolean>} Success status
   */
  const handleGenerateAndDownload = async (
    contractId: Id<"contracts">,
    options: {
      format?: "download" | "preview";
      includeSignatures?: boolean;
      watermark?: string;
    } = {}
  ): Promise<boolean> => {
    try {
      const result = await getPdfData({ contractId, ...options });
      if (result.success) {
        const doc = generatePdf(result);
        const filename = `${result.contract.name.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-")}-v${result.contract.version || "1.0"}.pdf`;
        if (options.format === "preview") {
          const pdfBlob = doc.output("blob");
          const url = URL.createObjectURL(pdfBlob);
          const newWindow = window.open(url, "_blank");
          if (!newWindow) {
            toast.error("Popup Blocked", {
              description: "Please allow popups to preview the PDF.",
              duration: 4000,
            });
            return false;
          }
        } else {
          doc.save(filename);
        }
        return true;
      } else {
        toast.error("PDF Generation Failed", {
          description:
            result.error || "Unable to generate PDF. Please try again.",
          duration: 5000,
        });
        return false;
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      let errorMessage =
        "An unexpected error occurred while generating the PDF.";
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage =
            "Request timed out. The PDF might be too large to generate quickly.";
        } else {
          errorMessage = error.message;
        }
      }
      toast.error("PDF Generation Error", {
        description: errorMessage,
        duration: 6000,
      });
      return false;
    }
  };

  /**
   * Generates PDF for preview (opens in new tab) with error handling
   * @param {Id<"contracts">} contractId - Contract ID
   * @returns {Promise<boolean>} Success status
   */
  const handlePreviewPdf = async (
    contractId: Id<"contracts">
  ): Promise<boolean> => {
    return handleGenerateAndDownload(contractId, {
      format: "preview",
      includeSignatures: true,
      watermark: "PREVIEW",
    });
  };

  /**
   * Downloads PDF directly with error handling
   * @param {Id<"contracts">} contractId - Contract ID
   * @returns {Promise<boolean>} Success status
   */
  const handleDownloadPdf = async (
    contractId: Id<"contracts">
  ): Promise<boolean> => {
    return handleGenerateAndDownload(contractId, {
      format: "download",
      includeSignatures: true,
    });
  };

  return {
    generateAndDownload: handleGenerateAndDownload,
    previewPdf: handlePreviewPdf,
    downloadPdf: handleDownloadPdf,
  };
}
