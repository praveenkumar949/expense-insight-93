import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { useSavings } from "@/hooks/useSavings";
import { format } from "date-fns";
import { formatIndianCurrency } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";

const SavingsInsightsSection = () => {
  const { savings } = useSavings();
  const { toast } = useToast();

  // Process savings data by month
  const monthlySavings = savings.reduce((acc, entry) => {
    const monthKey = format(entry.date, "MMM yyyy");
    acc[monthKey] = (acc[monthKey] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlySavings).map(([month, amount]) => ({
    month,
    amount,
  })).slice(-6); // Last 6 months

  const exportSavingsReport = () => {
    try {
      const csvContent = [
        ["Month", "Total Savings"],
        ...Object.entries(monthlySavings).map(([month, amount]) => [month, amount])
      ].map(row => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `savings-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Savings report has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export savings report",
        variant: "destructive",
      });
    }
  };

  // Find highest and lowest months
  const amounts = Object.values(monthlySavings);
  const highestMonth = Object.entries(monthlySavings).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  , ["", 0]);
  const lowestMonth = Object.entries(monthlySavings).reduce((min, entry) =>
    entry[1] < min[1] ? entry : min
  , ["", Infinity]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Savings Insights & Trends
            </CardTitle>
            <CardDescription>Track your savings progress over time</CardDescription>
          </div>
          <Button onClick={exportSavingsReport} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Line Chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Savings Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Monthly Comparison</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-semibold mb-1">Highest Savings Month</p>
            <p className="text-2xl font-bold text-primary">{formatIndianCurrency(highestMonth[1])}</p>
            <p className="text-xs text-muted-foreground">{highestMonth[0]}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-semibold mb-1">Lowest Savings Month</p>
            <p className="text-2xl font-bold text-amber-500">{formatIndianCurrency(lowestMonth[1])}</p>
            <p className="text-xs text-muted-foreground">{lowestMonth[0]}</p>
          </div>
        </div>

        {/* Trend Analysis */}
        {chartData.length >= 2 && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Trend Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {(() => {
                const lastMonth = chartData[chartData.length - 1].amount;
                const prevMonth = chartData[chartData.length - 2].amount;
                const change = ((lastMonth - prevMonth) / prevMonth) * 100;
                return change > 0
                  ? `Your savings increased by ${change.toFixed(1)}% this month. Great job!`
                  : `Your savings decreased by ${Math.abs(change).toFixed(1)}% this month. Consider reviewing your budget.`;
              })()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsInsightsSection;