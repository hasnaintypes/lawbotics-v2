import { mutation , query } from "./_generated/server"
import { v } from "convex/values"

export const createAnalysis = mutation({
  args: {
    documentId: v.id("documents"),
    partyPerspective: v.string(),
    analysisDepth: v.union(v.literal("summary"), v.literal("full")),
    analysisBias: v.union(v.literal("neutral"), v.literal("favorable"), v.literal("risk")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      documentId: args.documentId,
      partyPerspective: args.partyPerspective,
      analysisDepth: args.analysisDepth,
      analysisBias: args.analysisBias,
      status: "pending",
      document: {
        id: "",
        title: "",
        type: "",
        status: "",
        parties: [],
        effectiveDate: "unknown", // Default value for effectiveDate
        expirationDate: "unknown", // Default value for expirationDate
        value: "unknown", // Default value for value
      },
      createdAt: Date.now(),
    })
  },
})

export const updateAnalysisWithResult = mutation({
  args: {
    analysisId: v.id("analyses"),
    result: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.analysisId, {
      status: "complete",
      ...args.result,
    })
  },
})

export const updateAnalysisStatus = mutation({
  args: {
    analysisId: v.id("analyses"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("complete"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.analysisId, {
      status: args.status,
    })
  },
})

export const getAnalysis = query({
    args: {
      analysisId: v.id("analyses"),
    },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.analysisId)
    },
  })

// export const getLatestUniqueAnalysesForUser = query({
//   args: {
//     userId: v.string(), // Clerk User ID
//   },
//   handler: async (ctx, args) => {
//     // 1. Fetch the Convex user object based on the provided userId.
//     const user = await ctx.db
//       .query("users")
//       .filter((q) => q.eq(q.field("userId"), args.userId))
//       .first()

//     // 2. If the user is not found, return an empty array.
//     if (!user) {
//       return []
//     }

//     // 3. Fetch all documents owned by this user._id.
//     const documents = await ctx.db
//       .query("documents")
//       .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
//       .collect()

//     if (documents.length === 0) {
//       return []
//     }

//     // 4. Initialize a map to store the latest analysis for each document title.
//     const latestAnalysesMap = new Map()

//     // 5. Iterate through each document.
//     for (const doc of documents) {
//       // Fetch all analyses associated with the current document._id, ordered by createdAt desc.
//       const analysesForDocument = await ctx.db
//         .query("analyses")
//         .withIndex("by_document", (q) => q.eq("documentId", doc._id))
//         .order("desc") // Orders by _creationTime descending by default if not specified, but good to be explicit with createdAt if that's the intended field.
//         // If you have a specific 'createdAt' field you are sorting by, ensure it's indexed or this could be slow.
//         // Assuming 'createdAt' is a field in 'analyses' table and you want to sort by it.
//         // If you mean sort by Convex's internal _creationTime, .order("desc") is sufficient.
//         // For this example, let's assume there's a `createdAt` field in the `analyses` table as per the schema provided.
//         // We'll sort by `_creationTime` which is implicit in `.order("desc")` if no field is given to `q.field()`
//         .collect() // Fetch all to then pick the latest based on a potential custom createdAt or rely on _creationTime

//       if (analysesForDocument.length > 0) {
//         // The first one is the latest because of order("desc") on _creationTime or a specific createdAt field.
//         const latestAnalysisForThisDocument = analysesForDocument[0]

//         // Ensure document title exists
//         if (latestAnalysisForThisDocument.document && latestAnalysisForThisDocument.document.title) {
//           const existingAnalysis = latestAnalysesMap.get(latestAnalysisForThisDocument.document.title)
//           if (existingAnalysis) {
//             // Compare timestamps (assuming createdAt is a number, e.g., Date.now())
//             if (latestAnalysisForThisDocument.createdAt > existingAnalysis.createdAt) {
//               latestAnalysesMap.set(latestAnalysisForThisDocument.document.title, latestAnalysisForThisDocument)
//             }
//           } else {
//             latestAnalysesMap.set(latestAnalysisForThisDocument.document.title, latestAnalysisForThisDocument)
//           }
//         }
//       }
//     }

//     // 6. Convert the values of latestAnalysesMap into an array and return it.
//     return Array.from(latestAnalysesMap.values())
//   },
// })
  
  export const getLatestAnalysisForDocument = query({
    args: {
      documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("analyses")
        .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
        .order("desc")
        .first()
    },
  })

export const getLatestUniqueAnalysesForUser = query({
  args: {
    userId: v.string(), // Clerk User ID
  },
  handler: async (ctx, args) => {
    // 1. Fetch the Convex user object based on the provided userId.
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    // 2. If the user is not found, return an empty array.
    if (!user) {
      return []
    }

    // 3. Fetch all documents owned by this user._id.
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect()

    if (documents.length === 0) {
      return []
    }

    // 4. Initialize a map to store the latest analysis for each document title.
    const latestAnalysesMap = new Map()

    // 5. Iterate through each document.
    for (const doc of documents) {
      // Fetch all analyses associated with the current document._id, ordered by createdAt desc.
      const analysesForDocument = await ctx.db
        .query("analyses")
        .withIndex("by_document", (q) => q.eq("documentId", doc._id))
        .order("desc") // Orders by _creationTime descending by default if not specified, but good to be explicit with createdAt if that's the intended field.
        // If you have a specific 'createdAt' field you are sorting by, ensure it's indexed or this could be slow.
        // Assuming 'createdAt' is a field in 'analyses' table and you want to sort by it.
        // If you mean sort by Convex's internal _creationTime, .order("desc") is sufficient.
        // For this example, let's assume there's a `createdAt` field in the `analyses` table as per the schema provided.
        // We'll sort by `_creationTime` which is implicit in `.order("desc")` if no field is given to `q.field()`
        .collect() // Fetch all to then pick the latest based on a potential custom createdAt or rely on _creationTime

      if (analysesForDocument.length > 0) {
        // The first one is the latest because of order("desc") on _creationTime or a specific createdAt field.
        const latestAnalysisForThisDocument = analysesForDocument[0]

        // Ensure document title exists
        if (latestAnalysisForThisDocument.document && latestAnalysisForThisDocument.document.title) {
          const existingAnalysis = latestAnalysesMap.get(latestAnalysisForThisDocument.document.title)
          if (existingAnalysis) {
            // Compare timestamps (assuming createdAt is a number, e.g., Date.now())
            // Add author information to the analysis object
            const analysisWithAuthor = {
              ...latestAnalysisForThisDocument,
              author: user.name, // Add the author's name
            };

            if (latestAnalysisForThisDocument.createdAt > existingAnalysis.createdAt) {
              latestAnalysesMap.set(latestAnalysisForThisDocument.document.title, analysisWithAuthor)
            }
          } else {
            latestAnalysesMap.set(latestAnalysisForThisDocument.document.title, {
              ...latestAnalysisForThisDocument,
              author: user.name, // Add the author's name
            })
          }
        }
      }
    }

    // 6. Convert the values of latestAnalysesMap into an array and return it.
    return Array.from(latestAnalysesMap.values())
  },
})