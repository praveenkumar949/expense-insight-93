import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [result, setResult] = useState<{
    interest: number;
    totalAmount: number;
    chartData: Array<{ name: string; value: number }>;
  } | null>(null);

  const calculateSimpleInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (p && r && t) {
      const interest = p * r * t;
      const totalAmount = p + interest;

      setResult({
        interest: Math.round(interest),
        totalAmount: Math.round(totalAmount),
        chartData: [
          { name: "Principal", value: Math.round(p) },
          { name: "Interest", value: Math.round(interest) },
        ],
      });
    }
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-wants))"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Interest Calculator</CardTitle>
        <CardDescription>Calculate simple interest on your investment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="si-principal">Principal Amount (₹)</Label>
          <Input
            id="si-principal"
            type="number"
            placeholder="Enter principal amount"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="si-rate">Interest Rate (% per annum)</Label>
          <Input
            id="si-rate"
            type="number"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="si-time">Time Period (years)</Label>
          <Input
            id="si-time"
            type="number"
            placeholder="Enter time period"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Button onClick={calculateSimpleInterest} className="w-full">
          Calculate Simple Interest
        </Button>

        {result && (
          <>
            <div className="space-y-3 rounded-lg border bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary">{formatIndianCurrency(result.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Principal</span>
                <span className="text-lg font-semibold">{formatIndianCurrency(parseFloat(principal))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interest Earned</span>
                <span className="text-lg font-semibold text-success">{formatIndianCurrency(result.interest)}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Interest Breakdown</h4>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default SimpleInterestCalculator;
