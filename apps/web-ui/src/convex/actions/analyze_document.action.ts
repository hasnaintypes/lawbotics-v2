"use node";

import { action } from "@/convex/_generated/server";
import { v } from "convex/values";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Helper function to parse retry delay from Google API error
function parseRetryDelay(retryDelay: string): number {
  // Handles formats like "52s", "5s", "1.2s"
  const seconds = parseFloat(retryDelay.replace("s", ""));
  return isNaN(seconds) ? 10 : seconds; // fallback to 10s if parsing fails
}

// Define the schema for the analysis result
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
    }),
  ),
  negotiableTerms: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.string(),
      currentLanguage: z.string(),
      suggestedLanguage: z.string(),
      rationale: z.string().optional(),
    }),
  ),
  redFlags: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.string(),
      location: z.string().optional(),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  overallImpression: z.object({
    summary: z.string(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()),
    conclusion: z.string(),
  }),
});

export const analyzeDocument: ReturnType<typeof action> = action({
  args: {
    documentId: v.id("documents"),
    partyPerspective: v.string(),
    analysisDepth: v.union(v.literal("summary"), v.literal("full")),
    analysisBias: v.union(v.literal("neutral"), v.literal("favorable"), v.literal("risk")),
  },
  handler: async (ctx, args) => {
    // Create a pending analysis record
    const analysisId = await ctx.runMutation(api.analyses.createAnalysis, {
      documentId: args.documentId,
      partyPerspective: args.partyPerspective,
      analysisDepth: args.analysisDepth,
      analysisBias: args.analysisBias,
    });

    // Update document status to analyzing
    await ctx.runMutation(api.documents.updateDocument, {
      documentId: args.documentId,
      status: "processing",
      updatedAt: Date.now(),
    });

    try {
      // Get document content
      const document = await ctx.runQuery(api.documents.getDocument, {
        documentId: args.documentId,
      });
      if (!document) {
        throw new Error("Document not found");
      }

      // Get the prompt template
      const promptTemplate = await ctx.runQuery(api.prompts.getLegalAnalysisPrompt, {});
      console.log("Prompt Template:", promptTemplate);

      // Prepare the prompt
      const prompt = promptTemplate
        .replace("{{PARTY_PERSPECTIVE}}", args.partyPerspective)
        .replace("{{ANALYSIS_DEPTH}}", args.analysisDepth)
        .replace("{{ANALYSIS_BIAS}}", args.analysisBias)
        .replace("{{DOCUMENT_CONTENT}}", document.content);

      console.log("Prompt:", prompt);

      // Generate analysis using Google Generative AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let attempts = 0;
      const maxRetries = 10; // Max number of retries
      let text = "";

      while (attempts < maxRetries) {
        try {
          console.log(`Attempt ${attempts + 1} to generate content...`);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          text = await response.text();
          console.log("Raw Response:", text);
          break; // Success, exit loop
        } catch (error: any) {
          console.error(`Error on attempt ${attempts + 1}:`, error);
          if (error.status === 429 && attempts < maxRetries - 1) {
            const retryInfo = error.errorDetails?.find(
              (d: any) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
            );
            const retryDelayStr = retryInfo?.retryDelay ?? "10s"; // Default to 10s if not provided
            const delayInSeconds = parseRetryDelay(retryDelayStr);
            
            console.warn(`Rate limited. Retrying in ${delayInSeconds}s... (Attempt ${attempts + 1}/${maxRetries})`);
            await new Promise((res) => setTimeout(res, delayInSeconds * 1000));
            attempts++;
          } else {
            // Non-429 error or max retries reached
            throw error; // Re-throw the error to be caught by the outer try-catch
          }
        }
      }
      if (attempts === maxRetries) {
        throw new Error("Failed to generate content after multiple retries due to rate limiting.");
      }


      // Try to extract JSON from the response
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

      // Removed Zod schema validation
      // Update analysis with result
      await ctx.runMutation(api.analyses.updateAnalysisWithResult, {
        analysisId,
        result: analysisResult,
      });

      // Update document status to completed
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

      // Update analysis status to failed
      await ctx.runMutation(api.analyses.updateAnalysisStatus, {
        analysisId,
        status: "failed",
      });

      // Update document status to failed
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
