import { Expense } from "@/types/finance";
import { format } from "date-fns";

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const exportToCSV = (expenses: Expense[], filename: string) => {
  if (expenses.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = ["Date", "Category", "Sub-Category", "Merchant", "Amount (₹)"];

  // Convert expenses to CSV rows
  const rows = expenses.map((expense) => [
    format(expense.date, "dd/MM/yyyy"),
    expense.category,
    expense.subCategory,
    expense.merchant,
    expense.amount.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
