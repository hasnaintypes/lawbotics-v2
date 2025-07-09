import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';


export type Analysis = Doc<"analyses"> & { author?: string }; 

interface AnalysisState {
  analyses: Analysis[];
  isLoading: boolean;
  error: any | null;
  fetchAnalyses: (convex: any, userId: string) => Promise<void>;
  addOrUpdateAnalysis: (analysis: Analysis) => void;
}

export const useAnalysisStore = create(
  persist<AnalysisState>(
    (set) => ({
      analyses: [],
      isLoading: false,
      error: null,
      fetchAnalyses: async (convex: any, userId: string) => {
    if (!userId) {
      set({ analyses: [], isLoading: false, error: null });
      return;
    }
    set({ isLoading: true, error: null });
    try {
    
      const result = await convex.query(api.analyses.getLatestUniqueAnalysesForUser, { userId });
      set({ analyses: result as Analysis[], isLoading: false });
    } catch (err) {
      console.error('Error fetching analyses:', err);
      set({ error: err, isLoading: false, analyses: [] });
    }
  },
  addOrUpdateAnalysis: (analysis: Analysis) => set((state) => {
    const existingIndex = state.analyses.findIndex(a => a._id === analysis._id);
    if (existingIndex !== -1) {
      // Update existing
      const newAnalyses = [...state.analyses];
      newAnalyses[existingIndex] = analysis;
      return { analyses: newAnalyses };
    }
    // Add new
    return { analyses: [...state.analyses, analysis] };
  }),
    }),
  {
    name: 'analysis-storage', 
   
  }
  )
);