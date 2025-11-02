import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import MonthSelector from "@/components/MonthSelector";
import TrendLineChart from "@/components/charts/TrendLineChart";
import ComparisonBarChart from "@/components/charts/ComparisonBarChart";
import { format, parse, subMonths } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatIndianCurrency } from "@/lib/csvExport";
import { exportToPDF, exportToDOCX } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const { selectedMonth, setSelectedMonth, currentMonthData, getMonthlyData, availableMonths, expenses } =
    useExpenses();
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "docx">("csv");

  // Comparison month selectors
  const [comparisonMonth1, setComparisonMonth1] = useState<string>(selectedMonth);
  const [comparisonMonth2, setComparisonMonth2] = useState<string>(() => {
    const prevDate = subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1);
    return format(prevDate, "yyyy-MM");
  });

  // Get previous month data
  const previousMonthDate = subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1);
  const previousMonthKey = format(previousMonthDate, "yyyy-MM");
  const previousMonthData = getMonthlyData(previousMonthKey);

  // Get comparison data
  const comparison1Data = getMonthlyData(comparisonMonth1);
  const comparison2Data = getMonthlyData(comparisonMonth2);

  // Calculate spending change
  const spendingChange = currentMonthData.totalSpending - previousMonthData.totalSpending;
  const spendingChangePercent = previousMonthData.totalSpending > 0 
    ? ((spendingChange / previousMonthData.totalSpending) * 100).toFixed(1)
    : 0;

  // Get all months data for trend
  const allMonthsData = availableMonths.map((month) => getMonthlyData(month)).reverse();

  const handleExportAll = () => {
    if (expenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses to export",
        variant: "destructive",
      });
      return;
    }

    const timestamp = format(new Date(), "yyyy-MM-dd");
    const exportData = expenses.map(exp => ({
      date: exp.date,
      category: exp.category,
      subCategory: exp.subCategory,
      merchant: exp.merchant,
      amount: exp.amount,
    }));

    try {
      if (exportFormat === "csv") {
        const csvHeader = ["Date", "Category", "Sub Category", "Merchant", "Amount"];
        const csvRows = exportData.map(item => [
          new Date(item.date).toLocaleDateString(),
          item.category,
          item.subCategory,
          item.merchant,
          item.amount
        ]);
        const csvContent = [csvHeader, ...csvRows].map(row => row.join(",")).join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `all-expenses-${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (exportFormat === "pdf") {
        exportToPDF(exportData, `all-expenses-${timestamp}.pdf`, "All Expenses Report");
      } else if (exportFormat === "docx") {
        exportToDOCX(exportData, `all-expenses-${timestamp}.doc`, "All Expenses Report");
      }

      toast({
        title: "Export Successful",
        description: `All expenses have been exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export expenses",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Analysis</h1>
          <p className="text-muted-foreground">Deep dive into your spending patterns</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
      </div>

      {/* Trend Analysis */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Track your total spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendLineChart monthlyData={allMonthsData} />
        </CardContent>
      </Card>

      {/* Month Comparison */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span>Month-to-Month Comparison:</span>
                <span className="text-primary">{format(parse(comparisonMonth1, "yyyy-MM", new Date()), "MMM yyyy")}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="text-primary">{format(parse(comparisonMonth2, "yyyy-MM", new Date()), "MMM yyyy")}</span>
              </CardTitle>
              <CardDescription>Compare spending across different months</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <MonthSelector
                selectedMonth={comparisonMonth1}
                onMonthChange={setComparisonMonth1}
                availableMonths={availableMonths}
              />
              <span className="text-sm text-muted-foreground">vs</span>
              <MonthSelector
                selectedMonth={comparisonMonth2}
                onMonthChange={setComparisonMonth2}
                availableMonths={availableMonths}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-center gap-4 rounded-lg bg-muted p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {format(parse(comparisonMonth1, "yyyy-MM", new Date()), "MMM yyyy")}
              </p>
              <p className="text-2xl font-bold">{formatIndianCurrency(comparison1Data.totalSpending)}</p>
            </div>
            <div className="flex items-center">
              {comparison1Data.totalSpending > comparison2Data.totalSpending ? (
                <ArrowUpRight className="h-6 w-6 text-destructive" />
              ) : comparison1Data.totalSpending < comparison2Data.totalSpending ? (
                <ArrowDownRight className="h-6 w-6 text-success" />
              ) : (
                <span className="text-muted-foreground">−</span>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {format(parse(comparisonMonth2, "yyyy-MM", new Date()), "MMM yyyy")}
              </p>
              <p className="text-2xl font-bold">{formatIndianCurrency(comparison2Data.totalSpending)}</p>
            </div>
          </div>
          <ComparisonBarChart currentMonth={comparison1Data} previousMonth={comparison2Data} />
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Detailed percentage distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentMonthData.categoryTotals
              .filter((item) => item.total > 0)
              .map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-xl font-bold sm:text-2xl">{item.percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {formatIndianCurrency(item.total)} spent this month
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Insights</CardTitle>
            <CardDescription>Key metrics and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold">Month Comparison</h4>
                {spendingChange !== 0 && (
                  spendingChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-success" />
                  )
                )}
              </div>
              <p className={`text-2xl font-bold ${spendingChange > 0 ? 'text-destructive' : spendingChange < 0 ? 'text-success' : ''}`}>
                {spendingChange > 0 ? '+' : ''}{formatIndianCurrency(Math.abs(spendingChange))}
              </p>
              <p className="text-sm text-muted-foreground">
                {spendingChange > 0 ? 'More' : 'Less'} than last month ({spendingChangePercent}%)
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Highest Category</h4>
              <p className="text-2xl font-bold text-primary">
                {currentMonthData.categoryTotals.reduce((max, item) =>
                  item.total > max.total ? item : max
                ).category}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatIndianCurrency(
                  currentMonthData.categoryTotals.reduce((max, item) =>
                    item.total > max.total ? item : max
                  ).total
                )}{" "}
                spent
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Total Transactions</h4>
              <p className="text-2xl font-bold">{currentMonthData.expenses.length}</p>
              <p className="text-sm text-muted-foreground">expenses recorded this month</p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Average Transaction</h4>
              <p className="text-2xl font-bold">
                {currentMonthData.expenses.length > 0
                  ? formatIndianCurrency(
                      currentMonthData.totalSpending / currentMonthData.expenses.length
                    )
                  : "₹0"}
              </p>
              <p className="text-sm text-muted-foreground">per expense</p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Daily Average</h4>
              <p className="text-2xl font-bold">
                {currentMonthData.expenses.length > 0
                  ? formatIndianCurrency(currentMonthData.totalSpending / 30)
                  : "₹0"}
              </p>
              <p className="text-sm text-muted-foreground">approximate daily spending</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Analysis;
