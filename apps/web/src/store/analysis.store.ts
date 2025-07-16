import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

/**
 * Extended analysis type that includes optional author information
 * Combines the base analysis document with additional metadata
 */
export type Analysis = Doc<"analyses"> & { author?: string };

/**
 * Analysis store state interface defining the structure and operations
 * for managing legal document analyses in the application
 */
interface AnalysisState {
  /** Array of analyses currently stored in the application */
  analyses: Analysis[];
  /** Loading state indicator for async operations */
  isLoading: boolean;
  /** Error state for handling and displaying errors */
  error: any | null;
  /** Fetches analyses for a specific user from the backend */
  fetchAnalyses: (convex: any, userId: string) => Promise<void>;
  /** Adds a new analysis or updates an existing one */
  addOrUpdateAnalysis: (analysis: Analysis) => void;
}

/**
 * Zustand store for managing legal document analyses state
 * Provides centralized state management with persistence for analyses data
 * Includes loading states, error handling, and CRUD operations
 */
export const useAnalysisStore = create(
  persist<AnalysisState>(
    (set) => ({
      analyses: [],
      isLoading: false,
      error: null,
      /**
       * Fetches the latest unique analyses for a user from the backend
       * Sets loading state during the operation and handles errors gracefully
       *
       * @param convex - The Convex client instance for API calls
       * @param userId - The Clerk user ID to fetch analyses for
       */
      fetchAnalyses: async (convex: any, userId: string) => {
        if (!userId) {
          set({ analyses: [], isLoading: false, error: null });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const result = await convex.query(
            api.analyses.getLatestUniqueAnalysesForUser,
            { userId }
          );
          set({ analyses: result as Analysis[], isLoading: false });
        } catch (err) {
          console.error("Error fetching analyses:", err);
          set({ error: err, isLoading: false, analyses: [] });
        }
      },
      /**
       * Adds a new analysis or updates an existing analysis in the store
       * Uses analysis ID to determine whether to update or add new entry
       *
       * @param analysis - The analysis object to add or update
       */
      addOrUpdateAnalysis: (analysis: Analysis) =>
        set((state) => {
          const existingIndex = state.analyses.findIndex(
            (a) => a._id === analysis._id
          );
          if (existingIndex !== -1) {
            const newAnalyses = [...state.analyses];
            newAnalyses[existingIndex] = analysis;
            return { analyses: newAnalyses };
          }
          return { analyses: [...state.analyses, analysis] };
        }),
    }),
    {
      name: "analysis-storage",
    }
  )
);
