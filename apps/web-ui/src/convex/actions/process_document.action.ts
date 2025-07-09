"use node";

import { action } from "@/convex/_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import fs from "fs/promises";
import os from "os";
import path from "path";

// Document loaders
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";        // PDFLoader for Node.js :contentReference[oaicite:4]{index=4}
import { TextLoader } from "langchain/document_loaders/fs/text";               // TextLoader for .txt files :contentReference[oaicite:5]{index=5}

// Text splitter
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";      // Chunk text into ~1k tokens :contentReference[oaicite:6]{index=6}

// Embedding model
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";       // Google GenAI embeddings :contentReference[oaicite:7]{index=7}

export const processDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    console.log(`[ProcessDocument] Starting processing for document: ${documentId}`);
    
    // 1️⃣ Fetch document record
    const doc = await ctx.runQuery(api.documents.getDocument, { documentId });
    if (!doc) {
      console.error(`[ProcessDocument] Document not found: ${documentId}`);
      throw new ConvexError("Document not found");
    }
    console.log(`[ProcessDocument] Retrieved document: ${JSON.stringify(doc, null, 2)}`);

    // Only process once
    if (doc.status !== "processing") {
      console.log(`[ProcessDocument] Document already processed with status: ${doc.status}`);
      return;
    }

    if (!doc.fileUrl) {
      console.error(`[ProcessDocument] No file URL available for document: ${documentId}`);
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        status: "failed",
        updatedAt: Date.now(),
      });
      throw new ConvexError("No file URL available");
    }

    try {
      // 2️⃣ Download file as buffer
      console.log(`[ProcessDocument] Downloading file from URL: ${doc.fileUrl}`);
      const resp = await axios.get<ArrayBuffer>(doc.fileUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(resp.data);
      console.log(`[ProcessDocument] Downloaded file size: ${buffer.length} bytes`);

      // 3️⃣ Write to a temp file
      const ext = doc.fileType.split("/")[1] || "bin";
      const tmpPath = path.join(os.tmpdir(), `${documentId.toString()}.${ext}`);
      console.log(`[ProcessDocument] Writing to temp file: ${tmpPath}`);
      await fs.writeFile(tmpPath, buffer);

      // 4️⃣ Load and parse text
      console.log(`[ProcessDocument] Loading document with type: ${doc.fileType}`);
      let documents;
      if (doc.fileType === "application/pdf") {
        const loader = new PDFLoader(tmpPath);
        documents = await loader.load();                                  // PDF pages → Document[] :contentReference[oaicite:8]{index=8}
        console.log(`[ProcessDocument] Loaded ${documents.length} PDF pages`);
      } else if (doc.fileType.startsWith("text/")) {
        const loader = new TextLoader(tmpPath);
        documents = await loader.load();                                  // Plain‑text → Document[] :contentReference[oaicite:9]{index=9}
        console.log(`[ProcessDocument] Loaded text document`);
      } else {
        console.error(`[ProcessDocument] Unsupported file type: ${doc.fileType}`);
        throw new ConvexError(`Unsupported file type: ${doc.fileType}`);
      }

      // 5️⃣ Split into chunks (~1k chars each)
      console.log(`[ProcessDocument] Splitting text into chunks`);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 6000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.splitDocuments(documents);
      console.log(`[ProcessDocument] Split into ${chunks.length} chunks`);

      // Concatenate all chunk texts to form the full content
      const fullContent = chunks.map((chunk) => chunk.pageContent).join("\n\n");

      // Update the document with the full content
await ctx.runMutation(api.documents.updateDocument, {
  documentId,
  content: fullContent,
  updatedAt: Date.now(),
});

      // 6️⃣ Embed chunks
      console.log(`[ProcessDocument] Initializing embeddings client`);
      const embeddingsClient = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/embedding-001",
      });
      
      // Take only first 10 chunks to stay within size limits
      const maxChunks = 10;
      const texts = chunks.slice(0, maxChunks).map((c) => c.pageContent);
      console.log(`[ProcessDocument] Generating embeddings for ${texts.length} chunks (limited to ${maxChunks})`);
      const vectors = await embeddingsClient.embedDocuments(texts);
      console.log(`[ProcessDocument] Generated ${vectors.length} embeddings`);

      // 7️⃣ Update Convex record
      console.log(`[ProcessDocument] Updating document record with embeddings`);
      await ctx.runMutation(api.documents.updateDocument, {
        documentId,
        vectorEmbedding: vectors.flat(),
        status: "completed",
        updatedAt: Date.now(),
      });

      // 8️⃣ Cleanup temp file
      console.log(`[ProcessDocument] Cleaning up temp file`);
      await fs.unlink(tmpPath);
      console.log(`[ProcessDocument] Processing completed successfully`);
    } catch (err) {
      console.error(`[ProcessDocument] Error processing document:`, err);
      // Mark as failed on any error
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
