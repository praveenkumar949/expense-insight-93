import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const LumpsumCalculator = () => {
  const [investment, setInvestment] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [result, setResult] = useState<{
    maturityAmount: number;
    investedAmount: number;
    returns: number;
    chartData: Array<{ name: string; value: number }>;
  } | null>(null);

  const calculateLumpsum = () => {
    const p = parseFloat(investment);
    const r = parseFloat(expectedReturn) / 100;
    const t = parseFloat(timePeriod);

    if (p && r && t) {
      const maturityAmount = p * Math.pow(1 + r, t);
      const returns = maturityAmount - p;

      setResult({
        maturityAmount: Math.round(maturityAmount),
        investedAmount: Math.round(p),
        returns: Math.round(returns),
        chartData: [
          { name: "Invested", value: Math.round(p) },
          { name: "Returns", value: Math.round(returns) },
        ],
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lumpsum Calculator</CardTitle>
        <CardDescription>Calculate returns on one-time investments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment">Investment Amount (₹)</Label>
          <Input
            id="investment"
            type="number"
            placeholder="Enter investment amount"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="return">Expected Return Rate (% per annum)</Label>
          <Input
            id="return"
            type="number"
            placeholder="Enter expected return rate"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Time Period (years)</Label>
          <Input
            id="period"
            type="number"
            placeholder="Enter time period in years"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          />
        </div>
        <Button onClick={calculateLumpsum} className="w-full">
          Calculate Lumpsum Returns
        </Button>

        {result && (
          <>
            <div className="space-y-3 rounded-lg border bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maturity Amount</span>
                <span className="text-xl font-bold text-primary">{formatIndianCurrency(result.maturityAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Invested</span>
                <span className="text-lg font-semibold">{formatIndianCurrency(result.investedAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Returns</span>
                <span className="text-lg font-semibold text-success">{formatIndianCurrency(result.returns)}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Investment Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={result.chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {result.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--chart-investments))"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LumpsumCalculator;
