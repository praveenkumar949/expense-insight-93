import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input as InputField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenses } from "@/hooks/useExpenses";
import { Category } from "@/types/finance";
import { format, parse } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2 } from "lucide-react";
import { exportToCSV, formatIndianCurrency } from "@/lib/csvExport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MonthSelector from "@/components/MonthSelector";

const Input = () => {
  const { addExpense, currentMonthData, deleteExpense, selectedMonth, setSelectedMonth, availableMonths } = useExpenses();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    category: "" as Category | "",
    subCategory: "",
    merchant: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.subCategory || !formData.merchant) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const date = new Date(formData.date);
    const month = format(date, "yyyy-MM");

    addExpense({
      date,
      amount: parseFloat(formData.amount),
      category: formData.category as Category,
      subCategory: formData.subCategory,
      merchant: formData.merchant,
      month,
    });

    toast({
      title: "Expense Added",
      description: "Your expense has been logged successfully",
    });

    // Reset form
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      amount: "",
      category: "" as Category | "",
      subCategory: "",
      merchant: "",
    });
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed",
    });
  };

  const handleExport = () => {
    if (currentMonthData.expenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses to export for this month",
        variant: "destructive",
      });
      return;
    }

    const monthName = format(parse(currentMonthData.month, "yyyy-MM", new Date()), "MMMM-yyyy");
    exportToCSV(currentMonthData.expenses, `expenses-${monthName}.csv`);
    toast({
      title: "Export Successful",
      description: "Your expenses have been exported to CSV",
    });
  };

  return (
    <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Log New Expense</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Add your expenses to track your spending</p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>Enter the details of your expense</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <InputField
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <InputField
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Needs">Needs</SelectItem>
                    <SelectItem value="Wants">Wants</SelectItem>
                    <SelectItem value="Investments">Investments</SelectItem>
                    <SelectItem value="EMIs">EMIs</SelectItem>
                    <SelectItem value="Loans">Loans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub-Category</Label>
                <InputField
                  id="subCategory"
                  placeholder="e.g., Groceries, Restaurant"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant/Description</Label>
                <InputField
                  id="merchant"
                  placeholder="e.g., Whole Foods, The Bistro"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              Current month: {formatIndianCurrency(currentMonthData.totalSpending)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthData.expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No expenses for this month
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentMonthData.expenses
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 10)
                      .map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{format(expense.date, "MMM dd")}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{formatIndianCurrency(expense.amount)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All expenses for the selected month</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                availableMonths={availableMonths}
              />
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-Category</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthData.expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No expenses for this month
                    </TableCell>
                  </TableRow>
                ) : (
                  currentMonthData.expenses
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(expense.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.subCategory}</TableCell>
                        <TableCell>{expense.merchant}</TableCell>
                        <TableCell className="font-semibold">
                          {formatIndianCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Input;
