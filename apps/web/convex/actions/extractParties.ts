"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Using centralized prompts from convex/prompts.ts
// The prompt template is fetched using: await ctx.runQuery(api.prompts.getPartyExtractionPrompt, {})

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
 * Extracts party information from a legal document using Google Generative AI
 * Updates document status throughout the process and stores extracted parties
 *
 * @param documentId - The ID of the document to extract parties from
 * @param documentContent - Optional document content. If not provided, will fetch from document
 * @return Object with success status, extracted parties, and stored record ID
 */
export const extractParties: ReturnType<typeof action> = action({
  args: {
    documentId: v.id("documents"),
    documentContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.documents.updateDocument, {
      documentId: args.documentId,
      status: "processing",
      updatedAt: Date.now(),
    });

    try {
      let documentContent = args.documentContent;

      // If content not provided, fetch it from the document
      if (!documentContent) {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: args.documentId,
        });

        if (!document) {
          throw new Error("Document not found");
        }

        if (!document.content) {
          throw new Error("Document content is not available");
        }

        documentContent = document.content;
      }

      const parties = await extractPartiesFromDocument(
        ctx,
        documentContent as string
      );
      const extractedPartiesId = await ctx.runMutation(
        api.extractedParties.storeExtractedParties,
        {
          documentId: args.documentId,
          parties,
        }
      );

      await ctx.runMutation(api.documents.updateDocument, {
        documentId: args.documentId,
        status: "completed",
        updatedAt: Date.now(),
      });

      return {
        success: true,
        parties,
        extractedPartiesId,
      };
    } catch (error) {
      console.error("Error extracting parties:", error);

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

/**
 * Extracts party names from legal document content using Google Generative AI
 * Implements robust retry logic with exponential backoff for rate limiting
 *
 * @param ctx - The Convex context for running queries
 * @param documentContent - The text content of the document to analyze
 * @return Array of party names found in the document
 * @throws Error if document content is empty, API key is missing, or extraction fails
 */
async function extractPartiesFromDocument(
  ctx: any,
  documentContent: string
): Promise<string[]> {
  if (!documentContent) {
    throw new Error("Document content is empty");
  }

  const apiKey = process.env.GOOGLE_API_KEY_1!;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  // Get the centralized prompt template
  const promptTemplate = await ctx.runQuery(
    api.prompts.getPartyExtractionPrompt,
    {}
  );

  // Replace placeholder with actual document content
  const finalPrompt = promptTemplate.replace(
    "{{DOCUMENT_CONTENT}}",
    documentContent.substring(0, 10000)
  );

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let attempts = 0;
  const maxRetries = 3; // Reduce retries for faster failure

  while (attempts < maxRetries) {
    try {
      const result = await model.generateContent(finalPrompt);
      const response = result.response;
      const text = response.text();

      if (typeof text !== "string") {
        throw new Error("Response is not a string");
      }

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      const parties = JSON.parse(jsonMatch[0]);
      if (
        !Array.isArray(parties) ||
        !parties.every((p) => typeof p === "string")
      ) {
        throw new Error("Invalid parties format");
      }
      console.log("Extracted parties:", parties);

      return parties;
    } catch (error: any) {
      console.error(
        `[extractPartiesFromDocument] Error calling Gemini SDK. Attempt: ${attempts + 1}, Error: ${error.message}`
      );
      console.log(
        `[extractPartiesFromDocument] Caught error.status: ${error.status}, typeof error.status: ${typeof error.status}`
      );

      if (Number(error.status) === 429) {
        const retryInfo = error.errorDetails?.find(
          (d: any) =>
            d && d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
        );

        let apiSuggestedDelaySeconds: number;
        const apiProvidedRetryDelayStr = retryInfo?.retryDelay;
        if (apiProvidedRetryDelayStr) {
          apiSuggestedDelaySeconds = parseRetryDelay(apiProvidedRetryDelayStr);
        } else {
          apiSuggestedDelaySeconds = 10;
          console.warn(
            `[extractPartiesFromDocument] API did not provide retryDelay. Using default of ${apiSuggestedDelaySeconds}s for API suggestion component.`
          );
        }

        const baseExponentialFactorSeconds = 1;
        const exponentialComponentSeconds =
          2 ** attempts * baseExponentialFactorSeconds;

        let calculatedDelaySeconds = Math.max(
          apiSuggestedDelaySeconds,
          exponentialComponentSeconds
        );

        const jitterMilliseconds = Math.floor(Math.random() * 1001);
        calculatedDelaySeconds += jitterMilliseconds / 1000;

        const maxSensibleDelaySeconds = 30; // Cap max delay to 30s
        const finalDelaySeconds = Math.min(
          calculatedDelaySeconds,
          maxSensibleDelaySeconds
        );

        console.warn(
          `[extractPartiesFromDocument] Rate limited (429). Attempt ${attempts + 1}/${maxRetries}. Retrying in ${finalDelaySeconds.toFixed(2)}s. (API suggested: ${apiSuggestedDelaySeconds}s, Exponential base: ${exponentialComponentSeconds}s)`
        );

        attempts++;
        if (attempts < maxRetries) {
          await new Promise((res) => setTimeout(res, finalDelaySeconds * 1000));
          continue;
        } else {
          console.error(
            `[extractPartiesFromDocument] Max retries (${maxRetries}) reached after a 429 error. Not retrying further.`
          );
        }
      } else {
        console.error(
          `[extractPartiesFromDocument] Non-429 error or status check failed. Rethrowing original error. Status: ${error.status}, Message: ${error.message}`
        );
        throw error;
      }
    }
  }

  console.error(
    `[extractPartiesFromDocument] Failed after ${attempts} attempts due to persistent errors.`
  );
  throw new Error(
    `Failed to extract parties after ${maxRetries} attempts due to persistent errors.`
  );
}
