// Weekly Activity Data
export const weekly_activity_data = [
    { day: "Mon", uploads: 12, reviews: 8 },
    { day: "Tue", uploads: 19, reviews: 12 },
    { day: "Wed", uploads: 15, reviews: 10 },
    { day: "Thu", uploads: 22, reviews: 15 },
    { day: "Fri", uploads: 28, reviews: 18 },
    { day: "Sat", uploads: 8, reviews: 5 },
    { day: "Sun", uploads: 6, reviews: 4 },
  ]
  
  // Risk Distribution Data (Pie Chart)
  export const risk_distribution_data = [
    { name: "Low Risk", value: 65, fill: "hsl(var(--chart-1))" },
    { name: "Medium Risk", value: 25, fill: "hsl(var(--chart-2))" },
    { name: "High Risk", value: 10, fill: "hsl(var(--chart-3))" },
  ]
  
  // Document Volume Data (Area Chart)
  export const document_volume_data = [
    { month: "Jan", documents: 65 },
    { month: "Feb", documents: 78 },
    { month: "Mar", documents: 92 },
    { month: "Apr", documents: 88 },
    { month: "May", documents: 105 },
    { month: "Jun", documents: 118 },
  ]
  
  // Monthly Document Analysis Data (Big Rectangle Chart)
  export const monthly_analysis_data = [
    { month: "Jan", contracts: 25, agreements: 15, ndas: 12, licenses: 8, others: 5 },
    { month: "Feb", contracts: 30, agreements: 18, ndas: 15, licenses: 10, others: 5 },
    { month: "Mar", contracts: 35, agreements: 22, ndas: 18, licenses: 12, others: 5 },
    { month: "Apr", contracts: 32, agreements: 20, ndas: 16, licenses: 12, others: 8 },
    { month: "May", contracts: 40, agreements: 25, ndas: 20, licenses: 15, others: 5 },
    { month: "Jun", contracts: 45, agreements: 28, ndas: 22, licenses: 18, others: 5 },
  ]
  
  // Minimum data requirements for charts
  export const CHART_MIN_DATA_REQUIREMENTS = {
    weekly_activity: 3,
    risk_distribution: 1,
    document_volume: 2,
    monthly_analysis: 3,
  }
  