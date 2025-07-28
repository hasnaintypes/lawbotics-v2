"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

/**
 * Parses retry delay from Google API error response
 * @param retryDelay - The retry delay string from the API (e.g., "52s", "5s", "1.2s")
 * @return The delay in seconds, with fallback to 10 seconds if parsing fails
 */
function parseRetryDelay(retryDelay: string): number {
  const seconds = parseFloat(retryDelay.replace("s", ""));
  return isNaN(seconds) ? 10 : seconds;
}

/**
 * Zod schema for validating legal document analysis results
 * Ensures the AI response matches the expected structure
 */
const AnalysisResultSchema = z.object({
  document: z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    status: z.string(),
    parties: z.array(z.string()),
    effectiveDate: z.string(),
    expirationDate: z.string().optional(),
    value: z.string().optional(),
  }),
  riskScore: z.number(),
  keyClauses: z.array(
    z.object({
      title: z.string(),
      section: z.string(),
      text: z.string(),
      importance: z.string(),
      analysis: z.string(),
      recommendation: z.string().optional(),
    })
  ),
  negotiableTerms: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.string(),
      currentLanguage: z.string(),
      suggestedLanguage: z.string(),
      rationale: z.string().optional(),
    })
  ),
  redFlags: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.string(),
      location: z.string().optional(),
    })
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  overallImpression: z.object({
    summary: z.string(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()),
    conclusion: z.string(),
  }),
});

/**
 * Analyzes a legal document using Google Generative AI
 * Creates an analysis record, processes the document with AI, and stores the results
 * Includes robust error handling and retry logic for API rate limiting
 *
 * @param documentId - The ID of the document to analyze
 * @param partyPerspective - The perspective from which to analyze the document
 * @param analysisBias - The bias to apply during analysis (neutral, favorable, or risk)
 * @return Object with success status and analysis ID, or error information
 */
export const analyzeDocument: ReturnType<typeof action> = action({
  args: {
    documentId: v.id("documents"),
    partyPerspective: v.string(),
    analysisBias: v.union(
      v.literal("neutral"),
      v.literal("favorable"),
      v.literal("risk")
    ),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.runMutation(api.analyses.createAnalysis, {
      documentId: args.documentId,
      partyPerspective: args.partyPerspective,
      analysisBias: args.analysisBias,
    });

    await ctx.runMutation(api.documents.updateDocument, {
      documentId: args.documentId,
      status: "processing",
      updatedAt: Date.now(),
    });

    try {
      const document = await ctx.runQuery(api.documents.getDocument, {
        documentId: args.documentId,
      });
      if (!document) {
        throw new Error("Document not found");
      }

      // Get the simple analysis prompt
      const promptTemplate = await ctx.runQuery(
        api.prompts.getLegalAnalysisPrompt
      );

      // Add a strict instruction to the prompt to return a special error code if the document is not a legal document, contract, policy, or agreement
      const strictNote = `IMPORTANT: If the provided document is NOT a legal document, contract, policy, agreement, or similar legal text, respond ONLY with the following JSON: {\"statuscode\": \"NOT_LEGAL_DOCUMENT\", \"note\": \"This PDF is not a legal document, contract, policy, or agreement.\" } and nothing else.`;
      const prompt = [
        strictNote,
        promptTemplate
          .replace(/{{PARTY_PERSPECTIVE}}/g, args.partyPerspective)
          .replace(/{{ANALYSIS_DEPTH}}/g, "full")
          .replace(/{{ANALYSIS_BIAS}}/g, args.analysisBias)
          .replace(/{{DOCUMENT_CONTENT}}/g, document.content),
      ].join("\n\n");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let attempts = 0;
      const maxRetries = 5;
      let text = "";
      let lastError: any = null;
      const startTime = Date.now();

      while (attempts < maxRetries) {
        try {
          console.log(`Attempt ${attempts + 1} to generate analysis...`);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          text = await response.text();
          break;
        } catch (error: any) {
          console.error(`Error on attempt ${attempts + 1}:`, error);
          lastError = error;

          const shouldRetry =
            (error.status === 429 || error.status === 503) &&
            attempts < maxRetries - 1;

          if (shouldRetry) {
            let delayInSeconds = 5;

            if (error.status === 429) {
              const retryInfo = error.errorDetails?.find(
                (d: any) =>
                  d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
              );
              const retryDelayStr = retryInfo?.retryDelay ?? "5s";
              delayInSeconds = parseRetryDelay(retryDelayStr);
            } else if (error.status === 503) {
              delayInSeconds = Math.min(5 * Math.pow(2, attempts), 30);
            }

            console.warn(
              `${error.status === 429 ? "Rate limited" : "Service unavailable"}. Retrying in ${delayInSeconds}s... (Attempt ${attempts + 1}/${maxRetries})`
            );
            await new Promise((res) => setTimeout(res, delayInSeconds * 1000));
            attempts++;
          } else {
            throw error;
          }
        }
      }

      if (attempts === maxRetries) {
        throw new Error(
          `Failed to generate content after ${maxRetries} retries. Last error: ${lastError?.message || "Unknown error"}`
        );
      }

      const processingTime = Date.now() - startTime;

      let analysisResult;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON object found in response");
        }
        analysisResult = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Error parsing analysis JSON:", parseError);
        throw new Error("Failed to parse analysis result from response");
      }

      // Check for special error code from AI indicating not a legal document
      if (
        analysisResult.statuscode === "NOT_LEGAL_DOCUMENT" ||
        analysisResult.statusCode === "NOT_LEGAL_DOCUMENT"
      ) {
        // Delete the analysis object from Convex
        await ctx.runMutation(api.analyses.deleteAnalysis, {
          analysisId,
        });
        await ctx.runMutation(api.documents.updateDocument, {
          documentId: args.documentId,
          status: "failed",
          updatedAt: Date.now(),
        });
        return {
          success: false,
          error:
            analysisResult.note ||
            "This PDF is not a legal document, contract, policy, or agreement.",
          code: "NOT_LEGAL_DOCUMENT",
        };
      }

      // Add metadata to the result
      const enrichedResult = {
        ...analysisResult,
        metadata: {
          processingTime,
          promptVersion: "2.0",
          aiModel: "gemini-1.5-pro",
          retries: attempts,
        },
        updatedAt: Date.now(),
      };

      await ctx.runMutation(api.analyses.updateAnalysisWithResult, {
        analysisId,
        result: enrichedResult,
      });

      await ctx.runMutation(api.documents.updateDocument, {
        documentId: args.documentId,
        status: "completed",
        updatedAt: Date.now(),
      });

      return {
        success: true,
        analysisId,
      };
    } catch (error) {
      console.error("Error analyzing document:", error);

      await ctx.runMutation(api.analyses.updateAnalysisStatus, {
        analysisId,
        status: "failed",
      });

      await ctx.runMutation(api.documents.updateDocument, {
        documentId: args.documentId,
        status: "failed",
        updatedAt: Date.now(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
