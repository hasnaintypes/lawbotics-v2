import { query } from "./_generated/server";
import { v } from "convex/values";

// Get the distribution of documents by risk score
export const getRiskDistribution = query({
  handler: async (ctx) => {
    const analyses = await ctx.db.query("analyses").collect();

    const riskDistribution = {
      "Low Risk": 0,
      "Medium Risk": 0,
      "High Risk": 0,
    };

    for (const analysis of analyses) {
      if (analysis.riskScore) {
        if (analysis.riskScore >= 0 && analysis.riskScore <= 3) {
          riskDistribution["Low Risk"]++;
        } else if (analysis.riskScore > 3 && analysis.riskScore <= 7) {
          riskDistribution["Medium Risk"]++;
        } else {
          riskDistribution["High Risk"]++;
        }
      }
    }

    return Object.entries(riskDistribution).map(([name, value]) => ({ name, value }));
  },
});

// Get the trend of documents created over time
export const getDocumentTrends = query({
    handler: async (ctx) => {
      const documents = await ctx.db.query("documents").order("desc").collect();
  
      const monthlyCounts: { [key: string]: number } = {};
  
      for (const doc of documents) {
        const date = new Date(doc.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
  
        if (!monthlyCounts[month]) {
          monthlyCounts[month] = 0;
        }
        monthlyCounts[month]++;
      }
  
      // Convert to format expected by the chart
      return Object.entries(monthlyCounts).map(([month, count]) => ({
        month,
        documents: count,
      }));
    },
  });