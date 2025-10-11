import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import MonthSelector from "@/components/MonthSelector";
import TrendLineChart from "@/components/charts/TrendLineChart";
import ComparisonBarChart from "@/components/charts/ComparisonBarChart";
import { format, parse, subMonths } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV, formatIndianCurrency } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const { selectedMonth, setSelectedMonth, currentMonthData, getMonthlyData, availableMonths, expenses } =
    useExpenses();
  const { toast } = useToast();

  // Get previous month data
  const previousMonthDate = subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1);
  const previousMonthKey = format(previousMonthDate, "yyyy-MM");
  const previousMonthData = getMonthlyData(previousMonthKey);

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

    exportToCSV(expenses, `all-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`);
    toast({
      title: "Export Successful",
      description: "All expenses have been exported to CSV",
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analysis</h1>
          <p className="text-muted-foreground">Deep dive into your spending patterns</p>
        </div>
        <div className="flex items-center gap-3">
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
          <CardTitle>Month-to-Month Comparison</CardTitle>
          <CardDescription>
            Compare current month with {format(previousMonthDate, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart currentMonth={currentMonthData} previousMonth={previousMonthData} />
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
                    <span className="text-2xl font-bold">{item.percentage.toFixed(0)}%</span>
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
            <CardDescription>Key takeaways from your spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;
