export type Category = "Needs" | "Wants" | "Investments" | "EMIs" | "Loans";

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: Category;
  subCategory: string;
  merchant: string;
  month: string; // Format: YYYY-MM
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  expenses: Expense[];
  totalSpending: number;
  categoryTotals: CategoryTotal[];
}
