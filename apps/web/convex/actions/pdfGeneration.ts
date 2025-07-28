"use node";
import { action } from "../_generated/server";
import puppeteer from "puppeteer";
import { GenericId, v } from "convex/values";
import { api } from "../_generated/api";

/**
 * Action to generate PDF for a contract
 * @param {Object} args - PDF generation arguments
 * @returns {Promise<Object>} PDF generation result
 */
export const generateContractPdf = action({
  args: {
    contractId: v.id("contracts"),
    format: v.optional(v.union(v.literal("download"), v.literal("preview"))),
    includeSignatures: v.optional(v.boolean()),
    watermark: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    pdfUrl?: string;
    filename?: string;
    size?: number;
    error?: string;
  }> => {
    try {
      const {
        contractId,
        format = "download",
        includeSignatures = true,
        watermark,
      } = args;

      // Get contract data with error handling
      const contract = await ctx.runQuery(api.contracts.getContract, {
        id: contractId,
      });
      if (!contract) {
        return {
          success: false,
          error:
            "Contract not found. Please ensure the contract exists and try again.",
        };
      }

      // Get contract parties with error handling
      let parties: {
        _id: GenericId<"contract_parties">;
        _creationTime: number;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        signedAt?: number | undefined;
        name: string;
        type:
          | "vendor"
          | "client"
          | "partner"
          | "employee"
          | "contractor"
          | "other";
        role: string;
        createdAt: number;
        contractId: GenericId<"contracts">;
        hasSigned: boolean;
      }[] = [];
      try {
        parties = await ctx.runQuery(api.contract_parties.getContractParties, {
          contractId,
        });
      } catch (error) {
        console.warn("Failed to load contract parties:", error);
        // Continue without parties if they can't be loaded
      }

      // Get contract revisions with error handling
      let revisions: {
        author: { name: string; email: string } | null;
        _id: GenericId<"contract_revisions">;
        _creationTime: number;
        content: string;
        createdAt: number;
        summary: string;
        version: string;
        authorId: GenericId<"users">;
        contractId: GenericId<"contracts">;
        changes: {
          description?: string | undefined;
          oldValue?: string | undefined;
          field: string;
          newValue: string;
        }[];
      }[] = [];
      try {
        revisions = await ctx.runQuery(
          api.contract_revisions.getContractRevisions,
          {
            contractId,
          }
        );
      } catch (error) {
        console.warn("Failed to load contract revisions:", error);
        // Continue without revisions if they can't be loaded
      }

      // Validate contract data
      if (!contract.name || !contract.content) {
        return {
          success: false,
          error:
            "Contract data is incomplete. Please ensure the contract has a name and content.",
        };
      }

      // Prepare PDF data
      const pdfData = {
        contract,
        parties,
        revisions,
        includeSignatures,
        watermark,
        generatedAt: new Date().toISOString(),
      };

      // Generate PDF using a PDF library
      const pdfResult = await generatePdfDocument(pdfData);

      if (!pdfResult.success) {
        return {
          success: false,
          error:
            pdfResult.error ||
            "Failed to generate PDF document. Please try again.",
        };
      }

      // Store PDF in file storage
      let fileUrl;
      try {
        fileUrl = await storePdfFile(
          ctx,
          pdfResult.buffer as Buffer,
          `contract-${contractId}-${Date.now()}.pdf`
        );
      } catch (storageError) {
        console.error("PDF storage failed:", storageError);
        return {
          success: false,
          error: "Failed to store PDF file. Please try again later.",
        };
      }

      return {
        success: true,
        pdfUrl: fileUrl,
        filename: `${contract.name.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-")}-v${contract.version}.pdf`,
        size: pdfResult.size,
      };
    } catch (error) {
      console.error("PDF generation failed:", error);

      let errorMessage = "An unexpected error occurred during PDF generation.";

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          errorMessage =
            "PDF generation timed out. The contract might be too large.";
        } else if (error.message.includes("memory")) {
          errorMessage =
            "Insufficient memory to generate PDF. Please try again later.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network error during PDF generation. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
});

/**
 * Generates PDF document from contract data
 * @param {Object} data - Contract data for PDF generation
 * @returns {Promise<Object>} PDF generation result
 */
async function generatePdfDocument(data: any): Promise<{
  success: boolean;
  buffer?: Buffer;
  size?: number;
  error?: string;
}> {
  try {
    // Validate input data
    if (!data.contract || !data.contract.name) {
      return {
        success: false,
        error: "Invalid contract data provided for PDF generation.",
      };
    }

    const htmlContent = generateContractHtml(data);

    if (!htmlContent || htmlContent.length < 100) {
      return {
        success: false,
        error: "Generated HTML content is too short or empty.",
      };
    }

    // Example using a hypothetical PDF service with error handling
    const pdfBuffer = await convertHtmlToPdf(htmlContent, {
      format: "A4",
      margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
      displayHeaderFooter: true,
      headerTemplate: generatePdfHeader(data.contract),
      footerTemplate: generatePdfFooter(data.contract),
    });

    return {
      success: true,
      buffer: pdfBuffer,
      size: pdfBuffer.length,
    };
  } catch (error) {
    console.error("PDF document generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "PDF generation failed",
    };
  }
}

/**
 * Generates HTML content for PDF conversion
 * @param {Object} data - Contract data
 * @returns {string} HTML content
 */
function generateContractHtml(data: any): string {
  const { contract, parties, includeSignatures, watermark } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${contract.name}</title>
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          line-height: 1.6; 
          margin: 0; 
          padding: 20px;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .contract-title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .contract-info { 
          font-size: 14px; 
          color: #666; 
        }
        .section { 
          margin: 20px 0; 
        }
        .section-title { 
          font-size: 18px; 
          font-weight: bold; 
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        .parties-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0;
        }
        .parties-table th, .parties-table td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left;
        }
        .parties-table th { 
          background-color: #f5f5f5; 
          font-weight: bold;
        }
        .clause { 
          margin: 15px 0; 
          padding: 10px 0;
        }
        .clause-title { 
          font-weight: bold; 
          margin-bottom: 8px;
        }
        .clause-content { 
          text-align: justify; 
        }
        .signature-section { 
          margin-top: 50px; 
          page-break-inside: avoid;
        }
        .signature-block { 
          display: inline-block; 
          width: 45%; 
          margin: 20px 2.5%;
          border-top: 1px solid #333;
          padding-top: 10px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 72px;
          color: rgba(200, 200, 200, 0.3);
          z-index: -1;
          pointer-events: none;
        }
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      ${watermark ? `<div class="watermark">${watermark}</div>` : ""}
      
      <div class="header">
        <div class="contract-title">${contract.name}</div>
        <div class="contract-info">
          Version ${contract.version} | Created: ${new Date(contract.createdAt).toLocaleDateString()}
          ${contract.status ? ` | Status: ${contract.status.toUpperCase()}` : ""}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Contract Information</div>
        <p><strong>Type:</strong> ${contract.type?.replace("_", " ").toUpperCase()}</p>
        ${contract.description ? `<p><strong>Description:</strong> ${contract.description}</p>` : ""}
        ${contract.value ? `<p><strong>Value:</strong> ${contract.currency || "USD"} ${contract.value.toLocaleString()}</p>` : ""}
        ${contract.startDate ? `<p><strong>Start Date:</strong> ${new Date(contract.startDate).toLocaleDateString()}</p>` : ""}
        ${contract.endDate ? `<p><strong>End Date:</strong> ${new Date(contract.endDate).toLocaleDateString()}</p>` : ""}
      </div>

      ${
        parties.length > 0
          ? `
        <div class="section">
          <div class="section-title">Contract Parties</div>
          <table class="parties-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Role</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              ${parties
                .map(
                  (party: any) => `
                <tr>
                  <td>${party.name}</td>
                  <td>${party.type.replace("_", " ").toUpperCase()}</td>
                  <td>${party.role}</td>
                  <td>
                    ${party.email ? `Email: ${party.email}<br>` : ""}
                    ${party.phone ? `Phone: ${party.phone}<br>` : ""}
                    ${party.address ? `Address: ${party.address}` : ""}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">Contract Terms and Conditions</div>
        <div class="clause-content">
          ${contract.content || "<p>Contract content will be displayed here.</p>"}
        </div>
      </div>

      ${
        includeSignatures
          ? `
        <div class="signature-section">
          <div class="section-title">Signatures</div>
          ${parties
            .map(
              (party: any) => `
            <div class="signature-block">
              <p><strong>${party.name}</strong></p>
              <p>Role: ${party.role}</p>
              <p>Date: _________________</p>
              <p>Signature: _________________</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div style="margin-top: 50px; font-size: 12px; color: #666; text-align: center;">
        <p>This document was generated on ${new Date().toLocaleString()}</p>
        <p>LawBotics Contract Management System</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates PDF header template
 * @param {Object} contract - Contract data
 * @returns {string} Header HTML
 */
function generatePdfHeader(contract: any): string {
  return `
    <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px 0;">
      <span>${contract.name} - Version ${contract.version}</span>
    </div>
  `;
}

/**
 * Generates PDF footer template
 * @param {Object} contract - Contract data
 * @returns {string} Footer HTML
 */
function generatePdfFooter(contract: any): string {
  return `
    <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px 0;">
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      <span style="margin-left: 20px;">LawBotics Contract Management</span>
    </div>
  `;
}

/**
 * Converts HTML to PDF (placeholder implementation)
 * @param {string} html - HTML content
 * @param {Object} options - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 */
async function convertHtmlToPdf(html: string, options: any): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true, // Changed from "new" to true for compatibility
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: options.format || "A4",
      margin: options.margin || {
        top: "1in",
        right: "1in",
        bottom: "1in",
        left: "1in",
      },
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || "",
      footerTemplate: options.footerTemplate || "",
      printBackground: true,
    });

    await browser.close();
    // Ensure the return type is Buffer, not just Uint8Array
    return Buffer.from(buffer);
  } catch (error) {
    await browser.close();
    throw error;
  }
}

/**
 * Stores PDF file in storage
 * @param {any} ctx - Convex action context
 * @param {Buffer} buffer - PDF buffer
 * @param {string} filename - File name
 * @returns {Promise<string>} File URL
 */
async function storePdfFile(
  ctx: any,
  buffer: Buffer,
  filename: string
): Promise<string> {
  // Store the PDF in Convex storage
  const storageId = await ctx.storage.store(buffer);
  // Get a public URL for the stored file
  const fileUrl = await ctx.storage.getUrl(storageId);
  return fileUrl;
}

/**
 * Action to get contract PDF data
 * @param {Object} args - Arguments to retrieve contract PDF data
 * @returns {Promise<Object>} Contract PDF data
 */
export const getContractPdfData: ReturnType<typeof action> = action({
  args: {
    contractId: v.id("contracts"),
    includeSignatures: v.optional(v.boolean()),
    watermark: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { contractId, includeSignatures = true, watermark } = args;

    // Get contract data
    const contract = await ctx.runQuery(api.contracts.getContract, {
      id: contractId,
    });
    if (!contract) {
      return { success: false, error: "Contract not found." };
    }

    // Get contract parties
    let parties: {
      _id: GenericId<"contract_parties">;
      _creationTime: number;
      email?: string | undefined;
      phone?: string | undefined;
      address?: string | undefined;
      signedAt?: number | undefined;
      name: string;
      type:
        | "vendor"
        | "client"
        | "partner"
        | "employee"
        | "contractor"
        | "other";
      role: string;
      createdAt: number;
      contractId: GenericId<"contracts">;
      hasSigned: boolean;
    }[] = [];
    try {
      parties = await ctx.runQuery(api.contract_parties.getContractParties, {
        contractId,
      });
    } catch {}

    // Get contract revisions
    let revisions: {
      author: { name: string; email: string } | null;
      _id: GenericId<"contract_revisions">;
      _creationTime: number;
      content: string;
      createdAt: number;
      summary: string;
      version: string;
      authorId: GenericId<"users">;
      contractId: GenericId<"contracts">;
      changes: {
        description?: string | undefined;
        oldValue?: string | undefined;
        field: string;
        newValue: string;
      }[];
    }[] = [];
    try {
      revisions = await ctx.runQuery(
        api.contract_revisions.getContractRevisions,
        { contractId }
      );
    } catch {}

    return {
      success: true,
      contract,
      parties,
      revisions,
      includeSignatures,
      watermark,
      generatedAt: new Date().toISOString(),
    };
  },
});
