import { useEffect, useCallback } from "react";
import type { ContractFormData } from "@/types/contract-form";

const STORAGE_KEY = "contractFormData";

export function usePersistentContractForm(
  formData: ContractFormData,
  updateFormData: (data: Partial<ContractFormData>) => void
) {
  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          updateFormData(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (formData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Helper to clear localStorage (e.g. after submit)
  const clearStoredForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { clearStoredForm };
}
