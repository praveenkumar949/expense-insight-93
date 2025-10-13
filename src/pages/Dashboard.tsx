import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";
import { useProfile } from "@/hooks/useProfile";
import MonthSelector from "@/components/MonthSelector";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { format, parse, subMonths } from "date-fns";
import { formatIndianCurrency } from "@/lib/csvExport";

const Dashboard = () => {
  const { selectedMonth, setSelectedMonth, currentMonthData, getMonthlyData, availableMonths } =
    useExpenses();
  const { profile } = useProfile();

  // Get previous month data for comparison
  const previousMonthDate = subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1);
  const previousMonthKey = format(previousMonthDate, "yyyy-MM");
  const previousMonthData = getMonthlyData(previousMonthKey);

  const percentageChange =
    previousMonthData.totalSpending > 0
      ? ((currentMonthData.totalSpending - previousMonthData.totalSpending) /
          previousMonthData.totalSpending) *
        100
      : 0;

  const isIncrease = percentageChange > 0;

  return (
    <div className="container px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">Track your monthly expenses at a glance</p>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
        />
      </div>

      {/* Total Spending Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-3xl font-bold sm:text-4xl">
                {formatIndianCurrency(currentMonthData.totalSpending)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isIncrease ? (
                <ArrowUp className="h-5 w-5 text-destructive" />
              ) : (
                <ArrowDown className="h-5 w-5 text-success" />
              )}
              <span
                className={`text-lg font-semibold ${
                  isIncrease ? "text-destructive" : "text-success"
                }`}
              >
                {Math.abs(percentageChange).toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Allocation Snapshot</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={currentMonthData.categoryTotals} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={currentMonthData.categoryTotals} />
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-base">Spending Tip</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {currentMonthData.categoryTotals.reduce((max, item) => 
                item.total > max.total ? item : max
              ).category === "Investments" 
                ? `Your investments spending is ${currentMonthData.categoryTotals.find(c => c.category === "Investments")?.percentage.toFixed(0)}% of your total budget. Consider reviewing this category for potential savings.`
                : `Focus on ${currentMonthData.categoryTotals.reduce((max, item) => 
                    item.total > max.total ? item : max
                  ).category} - it's your highest spending category this month.`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {isIncrease ? (
                  <ArrowUp className="h-4 w-4 text-destructive" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-success" />
                )}
              </div>
              <CardTitle className="text-base">Monthly Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your spending has {isIncrease ? 'increased' : 'decreased'} by {Math.abs(percentageChange).toFixed(1)}% compared to last month. {isIncrease ? 'Monitor your expenses to stay on track.' : 'Great job managing your expenses!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <CardTitle className="text-base">Budget Recommendation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on your spending pattern, consider allocating {formatIndianCurrency(Math.round(currentMonthData.totalSpending * 1.1))} for next month's budget to account for variations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Detailed breakdown with percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentMonthData.categoryTotals.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </span>
                    <span className="font-semibold">{formatIndianCurrency(item.total)}</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
