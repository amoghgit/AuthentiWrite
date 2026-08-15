import { useState, useEffect } from "react";
import { AnalysisData } from "@/data/mock-analysis";

export interface SavedAnalysis {
  id: string;
  title: string;
  date: string;
  result: AnalysisData;
}

const STORAGE_KEY = "authentiwrite_history";

export function useAnalysisHistory() {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addAnalysis = (text: string, result: AnalysisData) => {
    const words = text.trim().split(/\s+/);
    const title = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
    
    // Add new entry using functional state update to ensure latest history is used
    setHistory(prevHistory => {
      const newEntry: SavedAnalysis = {
        id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title || "Untitled Essay",
        date: new Date().toISOString(),
        result,
      };
      const updatedHistory = [newEntry, ...prevHistory];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const deleteAnalysis = (id: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addAnalysis,
    deleteAnalysis,
    clearHistory
  };
}
