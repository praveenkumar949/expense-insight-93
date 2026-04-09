import { useState, useEffect } from "react";

export interface SavingsEntry {
  id: string;
  date: Date;
  amount: number;
  source: string;
  description?: string;
}

const STORAGE_KEY = "paisatracker_savings";

export const useSavings = () => {
  const [savings, setSavings] = useState<SavingsEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savings));
  }, [savings]);

  const addSavings = (entry: Omit<SavingsEntry, "id">) => {
    const newEntry: SavingsEntry = {
      ...entry,
      id: `savings_${Date.now()}_${Math.random()}`,
    };
    setSavings([...savings, newEntry]);
  };

  const deleteSavings = (id: string) => {
    setSavings(savings.filter((entry) => entry.id !== id));
  };

  const totalSavings = savings.reduce((sum, entry) => sum + entry.amount, 0);

  return {
    savings,
    addSavings,
    deleteSavings,
    totalSavings,
  };
};
