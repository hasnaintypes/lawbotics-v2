"use node";
import { action } from "../_generated/server"
import { v } from "convex/values"
import { api } from "../_generated/api"

// Import the Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai"

function parseRetryDelay(retryDelay: string): number {
  // Handles formats like "52s", "5s", "1.2s"
  const seconds = parseFloat(retryDelay.replace("s", ""));
  return isNaN(seconds) ? 10 : seconds; // fallback to 10s
}



export const extractParties: ReturnType<typeof action> = action({
  args: {
    documentId: v.id("documents"),
    documentContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Update document status to extracting parties
    await ctx.runMutation(api.documents.updateDocument, {
      documentId: args.documentId,
      status: "processing",
      updatedAt: Date.now(),
    })

    try {
      // Call Gemini SDK to extract parties
      const parties = await extractPartiesFromDocument(args.documentContent)
      // Store extracted parties in Convex
      const extractedPartiesId = await ctx.runMutation(api.extractedParties.storeExtractedParties, {
        documentId: args.documentId,
        parties,
      })

      // Update document status to uploaded (ready for analysis)
      await ctx.runMutation(api.documents.updateDocument, {
        documentId: args.documentId,
        status: "completed",
        updatedAt: Date.now(),
      })

      return {
        success: true,
        parties,
        extractedPartiesId,
      }
    } catch (error) {
      console.error("Error extracting parties:", error)

      // Update document status to failed
      await ctx.runMutation(api.documents.updateDocument, {
        documentId: args.documentId,
        status: "failed",
        updatedAt: Date.now(),
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },
})

async function extractPartiesFromDocument(documentContent: string): Promise<string[]> {
  if (!documentContent) {
    throw new Error("Document content is empty");
  }

  const apiKey = process.env.GOOGLE_API_KEY_1!;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  const prompt = `
    You are a legal document analyzer. Extract all parties mentioned in this legal document.
    Return ONLY an array of party names in JSON format like ["Party Name 1", "Party Name 2"].
    Do not include any explanations or additional text.
    Replace any null values with "N/A".
    Document:
    ${documentContent.substring(0, 10000)}
  `;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let attempts = 0;
  const maxRetries = 10; // Increased max retries to handle persistent rate limiting

  while (attempts < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
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
      if (!Array.isArray(parties) || !parties.every(p => typeof p === "string")) {
        throw new Error("Invalid parties format");
      }
      console.log("Extracted parties:", parties);

      return parties;
    } catch (error: any) {
      console.error(`[extractPartiesFromDocument] Error calling Gemini SDK. Attempt: ${attempts + 1}, Error: ${error.message}`);
      console.log(`[extractPartiesFromDocument] Caught error.status: ${error.status}, typeof error.status: ${typeof error.status}`);

      if (Number(error.status) === 429) {
        const retryInfo = error.errorDetails?.find(
          (d: any) => d && d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
        );
        
        let apiSuggestedDelaySeconds: number;
        const apiProvidedRetryDelayStr = retryInfo?.retryDelay;
        if (apiProvidedRetryDelayStr) {
            apiSuggestedDelaySeconds = parseRetryDelay(apiProvidedRetryDelayStr);
        } else {
            apiSuggestedDelaySeconds = 10; // Default if API doesn't suggest (matches parseRetryDelay's fallback)
            console.warn(`[extractPartiesFromDocument] API did not provide retryDelay. Using default of ${apiSuggestedDelaySeconds}s for API suggestion component.`);
        }

        const baseExponentialFactorSeconds = 1; // Base factor for exponential backoff in seconds
        // 'attempts' is 0-indexed for the number of retries *already performed*.
        const exponentialComponentSeconds = (2 ** attempts) * baseExponentialFactorSeconds;
        
        let calculatedDelaySeconds = Math.max(apiSuggestedDelaySeconds, exponentialComponentSeconds);
        
        const jitterMilliseconds = Math.floor(Math.random() * 1001); // 0-1000ms jitter
        calculatedDelaySeconds += jitterMilliseconds / 1000;
        
        const maxSensibleDelaySeconds = 300; // Cap delay at 5 minutes
        const finalDelaySeconds = Math.min(calculatedDelaySeconds, maxSensibleDelaySeconds);

        console.warn(`[extractPartiesFromDocument] Rate limited (429). Attempt ${attempts + 1}/${maxRetries}. Retrying in ${finalDelaySeconds.toFixed(2)}s. (API suggested: ${apiSuggestedDelaySeconds}s, Exponential base: ${exponentialComponentSeconds}s)`);
        
        attempts++;
        if (attempts < maxRetries) {
          await new Promise((res) => setTimeout(res, finalDelaySeconds * 1000));
          continue;
        } else {
          console.error(`[extractPartiesFromDocument] Max retries (${maxRetries}) reached after a 429 error. Not retrying further.`);
        }
      } else {
        console.error(`[extractPartiesFromDocument] Non-429 error or status check failed. Rethrowing original error. Status: ${error.status}, Message: ${error.message}`);
        throw error;
      }
    }
  } // End of while loop

  console.error(`[extractPartiesFromDocument] Failed after ${attempts} attempts due to persistent errors.`);
  throw new Error(`Failed to extract parties after ${maxRetries} attempts due to persistent errors.`);
}


