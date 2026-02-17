import { useState, useEffect } from 'react';
import type { HistoryEntry, MetadataData } from '../types/api';

const STORAGE_KEY = 'seo-history';
const MAX_ENTRIES = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [history]);

  const addSuccess = (url: string, keyword: string, result: MetadataData, id?: string) => {
    const entry: HistoryEntry = {
      id: id ?? Date.now().toString(),
      timestamp: new Date().toISOString(),
      url,
      keyword,
      success: true,
      result,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  };

  const addFailure = (url: string, keyword: string, error: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      url,
      keyword,
      success: false,
      error,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  };

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  const clearAll = () => setHistory([]);

  return { history, addSuccess, addFailure, deleteEntry, clearAll };
}
