"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { jsPDF } from "jspdf";
import MarkdownIt from "markdown-it";

/**
 * Contract PDF Generation Action
 *
 * This action generates a PDF from contract content and stores it in Convex storage.
 * Handles Markdown to PDF conversion with professional formatting using jsPDF.
 *
 * @param contractId - The ID of the contract to generate PDF for
 * @param content - The contract content in Markdown format
 * @param title - The title of the contract for the PDF
 * @returns Storage file ID and download URL
 */
export const generateContractPdf = action({
  args: {
    contractId: v.id("contracts"),
    content: v.string(),
    title: v.string(),
    metadata: v.optional(
      v.object({
        parties: v.optional(
          v.array(
            v.object({
              name: v.string(),
              role: v.string(),
              email: v.optional(v.string()),
            })
          )
        ),
        effectiveDate: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
        governingLaw: v.optional(v.string()),
        totalValue: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      // Generate PDF from markdown content
      const pdfBuffer = await generatePdfFromMarkdown(
        args.content,
        args.title,
        args.metadata
      );

      // Store the PDF in Convex storage
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const storageId = await ctx.storage.store(blob);

      // Get the download URL
      const downloadUrl = await ctx.storage.getUrl(storageId);

      return {
        success: true,
        storageId,
        downloadUrl,
        message: "PDF generated and stored successfully",
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to generate PDF: ${errorMessage}`);
    }
  },
});

/**
 * Generate PDF from Markdown content using jsPDF
 *
 * @param content - The contract content in Markdown format
 * @param title - The contract title
 * @param metadata - Contract metadata for header/footer
 * @returns Promise<ArrayBuffer> - PDF file as buffer
 */
async function generatePdfFromMarkdown(
  content: string,
  title: string,
  metadata?: {
    parties?: Array<{ name: string; role: string; email?: string }>;
    effectiveDate?: string;
    expirationDate?: string;
    governingLaw?: string;
    totalValue?: string;
  }
): Promise<ArrayBuffer> {
  // Initialize markdown parser
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // Convert markdown to HTML
  const htmlContent = md.render(content);

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font
  pdf.setFont("times", "normal");

  // Add title
  pdf.setFontSize(18);
  pdf.setFont("times", "bold");
  const titleWidth = pdf.getTextWidth(title);
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.text(title, (pageWidth - titleWidth) / 2, 30);

  // Add effective date if provided
  let yPosition = 50;
  if (metadata?.effectiveDate) {
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    pdf.text(`Effective Date: ${metadata.effectiveDate}`, 20, yPosition);
    yPosition += 10;
  }

  // Add parties section
  if (metadata?.parties && metadata.parties.length > 0) {
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont("times", "bold");
    pdf.text("Parties to this Agreement:", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    metadata.parties.forEach((party) => {
      pdf.text(`${party.role}: ${party.name}`, 25, yPosition);
      yPosition += 8;
    });
    yPosition += 10;
  }

  // Convert HTML to plain text and add content
  const plainTextContent = htmlContent
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n$1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n$1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n$1\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

  // Split content into lines and add to PDF
  const lines = pdf.splitTextToSize(plainTextContent, pageWidth - 40);

  lines.forEach((line: string) => {
    // Check if we need a new page
    if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });

  // Add signature section
  if (metadata?.parties && metadata.parties.length > 0) {
    // Add some space
    yPosition += 20;

    // Check if we need a new page for signatures
    if (yPosition > pdf.internal.pageSize.getHeight() - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont("times", "bold");
    pdf.text("Signatures:", 20, yPosition);
    yPosition += 15;

    metadata.parties.forEach((party) => {
      pdf.setFontSize(12);
      pdf.setFont("times", "normal");
      pdf.text(`${party.name}`, 20, yPosition);
      yPosition += 10;

      // Signature line
      pdf.line(20, yPosition, 120, yPosition);
      pdf.text("Signature", 20, yPosition + 8);
      yPosition += 15;

      // Date line
      pdf.line(20, yPosition, 80, yPosition);
      pdf.text("Date", 20, yPosition + 8);
      yPosition += 25;
    });
  }

  // Get PDF as array buffer
  const pdfOutput = pdf.output("arraybuffer");
  return pdfOutput;
}

/**
 * Get PDF download URL for a contract
 *
 * @param contractId - The ID of the contract
 * @returns Download URL for the contract PDF
 */
export const getContractPdfUrl = action({
  args: {
    contractId: v.id("contracts"),
  },
  handler: async (ctx, args) => {
    // Note: Actions cannot directly query the database
    // This should be called after generating a PDF to get the URL
    // The frontend should store the storageId from generateContractPdf response
    throw new Error(
      "Use the storageId from generateContractPdf response to get URL via ctx.storage.getUrl()"
    );
  },
});
