import { useState, useCallback, useMemo } from "react";
import { Expense, Category, CategoryTotal, MonthlyData } from "@/types/finance";
import { format } from "date-fns";

// Initialize with sample data
const sampleExpenses: Expense[] = [
  {
    id: "1",
    date: new Date(2025, 9, 25),
    amount: 1200,
    category: "Needs",
    subCategory: "Groceries",
    merchant: "Whole Foods",
    month: "2025-10",
  },
  {
    id: "2",
    date: new Date(2025, 9, 24),
    amount: 800,
    category: "Wants",
    subCategory: "Restaurant",
    merchant: "The Bistro",
    month: "2025-10",
  },
  {
    id: "3",
    date: new Date(2025, 9, 23),
    amount: 1500,
    category: "Investments",
    subCategory: "Mutual Funds",
    merchant: "Fidelity S&P 500 Index",
    month: "2025-10",
  },
  {
    id: "4",
    date: new Date(2025, 9, 22),
    amount: 1200,
    category: "EMIs",
    subCategory: "Home Loan",
    merchant: "Monthly Payment",
    month: "2025-10",
  },
  {
    id: "5",
    date: new Date(2025, 9, 21),
    amount: 800,
    category: "Loans",
    subCategory: "Personal Loan",
    merchant: "Monthly Payment",
    month: "2025-10",
  },
  // Previous month data
  {
    id: "6",
    date: new Date(2025, 8, 25),
    amount: 1100,
    category: "Needs",
    subCategory: "Groceries",
    merchant: "Whole Foods",
    month: "2025-09",
  },
  {
    id: "7",
    date: new Date(2025, 8, 24),
    amount: 600,
    category: "Wants",
    subCategory: "Shopping",
    merchant: "Mall",
    month: "2025-09",
  },
  {
    id: "8",
    date: new Date(2025, 8, 23),
    amount: 1500,
    category: "Investments",
    subCategory: "Stocks",
    merchant: "Trading Account",
    month: "2025-09",
  },
  {
    id: "9",
    date: new Date(2025, 8, 22),
    amount: 1200,
    category: "EMIs",
    subCategory: "Home Loan",
    merchant: "Monthly Payment",
    month: "2025-09",
  },
  {
    id: "10",
    date: new Date(2025, 8, 21),
    amount: 500,
    category: "Loans",
    subCategory: "Personal Loan",
    merchant: "Monthly Payment",
    month: "2025-09",
  },
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"));

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const getMonthlyData = useCallback(
    (month: string): MonthlyData => {
      const monthExpenses = expenses.filter((expense) => expense.month === month);
      const totalSpending = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const categoryTotals: CategoryTotal[] = (
        ["Needs", "Wants", "Investments", "EMIs", "Loans"] as Category[]
      ).map((category) => {
        const total = monthExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return {
          category,
          total,
          percentage: totalSpending > 0 ? (total / totalSpending) * 100 : 0,
        };
      });

      return {
        month,
        expenses: monthExpenses,
        totalSpending,
        categoryTotals,
      };
    },
    [expenses]
  );

  const currentMonthData = useMemo(
    () => getMonthlyData(selectedMonth),
    [selectedMonth, getMonthlyData]
  );

  const availableMonths = useMemo(() => {
    const months = new Set(expenses.map((expense) => expense.month));
    return Array.from(months).sort().reverse();
  }, [expenses]);

  return {
    expenses,
    addExpense,
    deleteExpense,
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    getMonthlyData,
    availableMonths,
  };
};
