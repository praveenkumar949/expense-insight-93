import { CategoryTotal } from "@/types/finance";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface CategoryBarChartProps {
  data: CategoryTotal[];
}

const COLORS = {
  Needs: "hsl(var(--chart-needs))",
  Wants: "hsl(var(--chart-wants))",
  Investments: "hsl(var(--chart-investments))",
  EMIs: "hsl(var(--chart-emis))",
  Loans: "hsl(var(--chart-loans))",
};

const CategoryBarChart = ({ data }: CategoryBarChartProps) => {
  const chartData = data
    .filter((item) => item.total > 0)
    .map((item) => ({
      category: item.category,
      amount: item.total,
      fill: COLORS[item.category],
    }));

  const chartConfig = {
    amount: { label: "Amount" },
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
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CategoryBarChart;
