import { CategoryTotal } from "@/types/finance";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface CategoryPieChartProps {
  data: CategoryTotal[];
}

const COLORS = {
  Needs: "hsl(var(--chart-needs))",
  Wants: "hsl(var(--chart-wants))",
  Investments: "hsl(var(--chart-investments))",
  EMIs: "hsl(var(--chart-emis))",
  Loans: "hsl(var(--chart-loans))",
};

const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  const chartData = data.filter((item) => item.total > 0);

  const chartConfig = {
    needs: { label: "Needs", color: COLORS.Needs },
    wants: { label: "Wants", color: COLORS.Wants },
    investments: { label: "Investments", color: COLORS.Investments },
    emis: { label: "EMIs", color: COLORS.EMIs },
    loans: { label: "Loans", color: COLORS.Loans },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="total"
            nameKey="category"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.category}`} fill={COLORS[entry.category]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CategoryPieChart;
