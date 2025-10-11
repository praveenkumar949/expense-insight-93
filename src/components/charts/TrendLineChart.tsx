import { MonthlyData } from "@/types/finance";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, parse } from "date-fns";

interface TrendLineChartProps {
  monthlyData: MonthlyData[];
}

const TrendLineChart = ({ monthlyData }: TrendLineChartProps) => {
  const chartData = monthlyData.map((data) => ({
    month: format(parse(data.month, "yyyy-MM", new Date()), "MMM yyyy"),
    total: data.totalSpending,
  }));

  const chartConfig = {
    total: { label: "Total Spending", color: "hsl(var(--primary))" },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TrendLineChart;
