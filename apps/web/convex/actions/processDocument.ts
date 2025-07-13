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
    console.log(
      `[ProcessDocument] Starting processing for document: ${documentId}`
    );

    const doc = await ctx.runQuery(api.documents.getDocument, { documentId });
    if (!doc) {
      console.error(`[ProcessDocument] Document not found: ${documentId}`);
      throw new ConvexError("Document not found");
    }
    console.log(
      `[ProcessDocument] Retrieved document: ${JSON.stringify(doc, null, 2)}`
    );

    if (doc.status !== "processing") {
      console.log(
        `[ProcessDocument] Document already processed with status: ${doc.status}`
      );
      return;
    }

    if (!doc.fileUrl) {
      console.error(
        `[ProcessDocument] No file URL available for document: ${documentId}`
      );
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        status: "failed",
        updatedAt: Date.now(),
      });
      throw new ConvexError("No file URL available");
    }

    try {
      console.log(
        `[ProcessDocument] Downloading file from URL: ${doc.fileUrl}`
      );
      const resp = await axios.get<ArrayBuffer>(doc.fileUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(resp.data);
      console.log(
        `[ProcessDocument] Downloaded file size: ${buffer.length} bytes`
      );

      const ext = doc.fileType.split("/")[1] || "bin";
      const tmpPath = path.join(os.tmpdir(), `${documentId.toString()}.${ext}`);
      console.log(`[ProcessDocument] Writing to temp file: ${tmpPath}`);
      await fs.writeFile(tmpPath, buffer);

      console.log(
        `[ProcessDocument] Loading document with type: ${doc.fileType}`
      );
      let documents;
      if (doc.fileType === "application/pdf") {
        const loader = new PDFLoader(tmpPath);
        documents = await loader.load();
        console.log(`[ProcessDocument] Loaded ${documents.length} PDF pages`);
      } else if (doc.fileType.startsWith("text/")) {
        const loader = new TextLoader(tmpPath);
        documents = await loader.load();
        console.log(`[ProcessDocument] Loaded text document`);
      } else {
        console.error(
          `[ProcessDocument] Unsupported file type: ${doc.fileType}`
        );
        throw new ConvexError(`Unsupported file type: ${doc.fileType}`);
      }

      console.log(`[ProcessDocument] Splitting text into chunks`);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 6000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.splitDocuments(documents);
      console.log(`[ProcessDocument] Split into ${chunks.length} chunks`);

      const fullContent = chunks.map((chunk) => chunk.pageContent).join("\n\n");

      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        content: fullContent,
        updatedAt: Date.now(),
      });

      console.log(`[ProcessDocument] Initializing embeddings client`);
      const embeddingsClient = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/embedding-001",
      });

      const maxChunks = 10;
      const texts = chunks.slice(0, maxChunks).map((c) => c.pageContent);
      console.log(
        `[ProcessDocument] Generating embeddings for ${texts.length} chunks (limited to ${maxChunks})`
      );
      const vectors = await embeddingsClient.embedDocuments(texts);
      console.log(`[ProcessDocument] Generated ${vectors.length} embeddings`);

      console.log(`[ProcessDocument] Updating document record with embeddings`);
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        vectorEmbedding: vectors.flat(),
        status: "completed",
        updatedAt: Date.now(),
      });

      console.log(`[ProcessDocument] Cleaning up temp file`);
      await fs.unlink(tmpPath);
      console.log(`[ProcessDocument] Processing completed successfully`);
    } catch (err) {
      console.error(`[ProcessDocument] Error processing document:`, err);
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        status: "failed",
        updatedAt: Date.now(),
      });
      throw err;
    }

    return { success: true };
  },
});
