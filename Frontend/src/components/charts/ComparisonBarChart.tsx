import { MonthlyData } from "@/types/finance";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { formatIndianCurrency } from "@/lib/csvExport";

interface ComparisonBarChartProps {
  currentMonth: MonthlyData;
  previousMonth: MonthlyData;
}

const COLORS = {
  Needs: "hsl(var(--chart-needs))",
  Wants: "hsl(var(--chart-wants))",
  Investments: "hsl(var(--chart-investments))",
  EMIs: "hsl(var(--chart-emis))",
  Loans: "hsl(var(--chart-loans))",
};

const ComparisonBarChart = ({ currentMonth, previousMonth }: ComparisonBarChartProps) => {
  const chartData = ["Needs", "Wants", "Investments", "EMIs", "Loans"].map((category) => {
    const currentTotal =
      currentMonth.categoryTotals.find((c) => c.category === category)?.total || 0;
    const previousTotal =
      previousMonth.categoryTotals.find((c) => c.category === category)?.total || 0;

    return {
      category,
      [currentMonth.month]: currentTotal,
      [previousMonth.month]: previousTotal,
      fill: COLORS[category as keyof typeof COLORS],
    };
  });

  const chartConfig = {
    [currentMonth.month]: { 
      label: currentMonth.month,
      color: "hsl(var(--primary))"
    },
    [previousMonth.month]: { 
      label: previousMonth.month,
      color: "hsl(var(--muted))"
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="category"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent 
              formatter={(value) => formatIndianCurrency(value as number)} 
            />} 
          />
          <Legend />
          <Bar 
            dataKey={previousMonth.month} 
            fill="hsl(var(--muted-foreground))" 
            radius={[8, 8, 0, 0]} 
            opacity={0.6}
          />
          <Bar 
            dataKey={currentMonth.month} 
            fill="hsl(var(--primary))" 
            radius={[8, 8, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ComparisonBarChart;
