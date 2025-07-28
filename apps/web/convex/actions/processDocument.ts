"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { api } from "../_generated/api";
import axios from "axios";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Processes an uploaded document by extracting text content and generating vector embeddings
 * Handles PDF and text files, splits content into chunks, and stores embeddings for semantic search
 * Updates document status throughout the processing pipeline
 *
 * @param documentId - The ID of the document to process
 * @return Success confirmation object
 * @throws ConvexError if document is not found, has no file URL, or processing fails
 */
export const processDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const doc = await ctx.runQuery(api.documents.getDocument, { documentId });
    if (!doc) throw new ConvexError("Document not found");
    if (doc.status !== "processing") return;
    if (!doc.fileUrl) {
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        status: "failed",
        updatedAt: Date.now(),
      });
      throw new ConvexError("No file URL available");
    }

    let tmpPath = "";
    try {
      // Download file
      const resp = await axios.get<ArrayBuffer>(doc.fileUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(resp.data);
      const ext = doc.fileType.split("/")[1] || "bin";
      tmpPath = path.join(os.tmpdir(), `${documentId.toString()}.${ext}`);
      await fs.writeFile(tmpPath, buffer);

      // Load document
      let documents;
      if (doc.fileType === "application/pdf") {
        documents = await new PDFLoader(tmpPath).load();
      } else if (doc.fileType.startsWith("text/")) {
        documents = await new TextLoader(tmpPath).load();
      } else {
        throw new ConvexError(`Unsupported file type: ${doc.fileType}`);
      }

      // Split into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 6000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.splitDocuments(documents);
      const fullContent = chunks.map((chunk) => chunk.pageContent).join("\n\n");

      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        content: fullContent,
        updatedAt: Date.now(),
      });

      // Embeddings
      const embeddingsClient = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/embedding-001",
      });
      const maxChunks = 10;
      const texts = chunks.slice(0, maxChunks).map((c) => c.pageContent);
      const vectors = await embeddingsClient.embedDocuments(texts);

      // Run Gemini legal check synchronously
      const checkResult = await ctx.runAction(
        api.actions.checkLegalDocument.checkLegalDocument,
        { documentId }
      );
      if (checkResult && checkResult.deleted) {
        // Document was deleted for not being legal, do not set status to completed
        return { success: false, deleted: true };
      }

      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        vectorEmbedding: vectors.flat(),
        status: "completed",
        updatedAt: Date.now(),
      });
    } catch (err) {
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        status: "failed",
        updatedAt: Date.now(),
      });
      throw err;
    } finally {
      if (tmpPath) {
        try {
          await fs.unlink(tmpPath);
        } catch {}
      }
    }
    return { success: true };
  },
});
