import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Gets comprehensive analytics data for dashboard charts
 * @param userId - The Clerk user ID to get analytics for
 * @return Object containing all chart data needed for dashboard
 */
export const getDashboardAnalytics = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      return {
        weeklyActivity: [],
        riskDistribution: [],
        documentVolume: [],
        monthlyAnalysis: [],
      };
    }

    // Get all documents for the user
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();

    if (documents.length === 0) {
      return {
        weeklyActivity: [],
        riskDistribution: [],
        documentVolume: [],
        monthlyAnalysis: [],
      };
    }

    const documentIds = documents.map((doc) => doc._id);

    // Get all analyses for these documents
    const allAnalyses = [];
    for (const docId of documentIds) {
      const analyses = await ctx.db
        .query("analyses")
        .withIndex("by_document", (q) => q.eq("documentId", docId))
        .collect();
      allAnalyses.push(...analyses);
    }

    // Calculate weekly activity (last 7 days)
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const weeklyActivity = [];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * oneDay);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      const dayEnd = dayStart + oneDay;

      const uploadsCount = documents.filter(
        (doc) => doc._creationTime >= dayStart && doc._creationTime < dayEnd
      ).length;

      const reviewsCount = allAnalyses.filter(
        (analysis) =>
          analysis._creationTime >= dayStart && analysis._creationTime < dayEnd
      ).length;

      weeklyActivity.push({
        day: dayNames[date.getDay()],
        uploads: uploadsCount,
        reviews: reviewsCount,
      });
    }

    // Calculate risk distribution
    const riskCounts = { low: 0, medium: 0, high: 0 };

    allAnalyses.forEach((analysis) => {
      if (analysis.riskScore) {
        const score = Number(analysis.riskScore);
        if (score >= 75) riskCounts.high++;
        else if (score >= 40) riskCounts.medium++;
        else riskCounts.low++;
      }
    });

    const totalAnalyses = riskCounts.low + riskCounts.medium + riskCounts.high;
    const riskDistribution =
      totalAnalyses > 0
        ? [
            {
              name: "Low Risk",
              value: Math.round((riskCounts.low / totalAnalyses) * 100),
              count: riskCounts.low,
            },
            {
              name: "Medium Risk",
              value: Math.round((riskCounts.medium / totalAnalyses) * 100),
              count: riskCounts.medium,
            },
            {
              name: "High Risk",
              value: Math.round((riskCounts.high / totalAnalyses) * 100),
              count: riskCounts.high,
            },
          ]
        : [];

    // Calculate document volume (last 6 months)
    const documentVolume = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).getTime();
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      const documentsCount = documents.filter(
        (doc) =>
          doc._creationTime >= monthStart && doc._creationTime <= monthEnd
      ).length;

      documentVolume.push({
        month: monthNames[date.getMonth()],
        documents: documentsCount,
      });
    }

    // Calculate monthly analysis by document type (last 6 months)
    const monthlyAnalysis = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).getTime();
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      const monthAnalyses = allAnalyses.filter(
        (analysis) =>
          analysis._creationTime >= monthStart &&
          analysis._creationTime <= monthEnd
      );

      const typeCounts = {
        contracts: 0,
        agreements: 0,
        ndas: 0,
        licenses: 0,
        others: 0,
      };

      monthAnalyses.forEach((analysis) => {
        const docType = analysis.document?.type?.toLowerCase() || "";
        if (docType.includes("contract")) typeCounts.contracts++;
        else if (docType.includes("agreement")) typeCounts.agreements++;
        else if (docType.includes("nda")) typeCounts.ndas++;
        else if (docType.includes("license")) typeCounts.licenses++;
        else typeCounts.others++;
      });

      monthlyAnalysis.push({
        month: monthNames[date.getMonth()],
        ...typeCounts,
      });
    }

    return {
      weeklyActivity,
      riskDistribution,
      documentVolume,
      monthlyAnalysis,
    };
  },
});

/**
 * Gets quick stats for analytics cards
 * @param userId - The Clerk user ID to get stats for
 * @return Object containing key metrics for analytics cards
 */
export const getAnalyticsStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      return {
        totalDocuments: 0,
        totalAnalyses: 0,
        avgRiskScore: 0,
        recentActivity: 0,
      };
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();

    const documentIds = documents.map((doc) => doc._id);
    const allAnalyses = [];

    for (const docId of documentIds) {
      const analyses = await ctx.db
        .query("analyses")
        .withIndex("by_document", (q) => q.eq("documentId", docId))
        .collect();
      allAnalyses.push(...analyses);
    }

    // Calculate average risk score
    const validRiskScores = allAnalyses
      .map((a) => Number(a.riskScore))
      .filter((score) => !isNaN(score) && score > 0);

    const avgRiskScore =
      validRiskScores.length > 0
        ? Math.round(
            validRiskScores.reduce((sum, score) => sum + score, 0) /
              validRiskScores.length
          )
        : 0;

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity = allAnalyses.filter(
      (analysis) => analysis._creationTime >= sevenDaysAgo
    ).length;

    return {
      totalDocuments: documents.length,
      totalAnalyses: allAnalyses.length,
      avgRiskScore,
      recentActivity,
    };
  },
});
