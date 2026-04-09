import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("1");
  const [result, setResult] = useState<{
    compoundInterest: number;
    totalAmount: number;
    chartData: Array<{ name: string; value: number }>;
  } | null>(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);

    if (p && r && t && n) {
      const totalAmount = p * Math.pow(1 + r / n, n * t);
      const compoundInterest = totalAmount - p;

      setResult({
        compoundInterest: Math.round(compoundInterest),
        totalAmount: Math.round(totalAmount),
        chartData: [
          { name: "Principal", value: Math.round(p) },
          { name: "Interest", value: Math.round(compoundInterest) },
        ],
      });
    }
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-investments))"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compound Interest Calculator</CardTitle>
        <CardDescription>Calculate compound interest with compounding frequency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ci-principal">Principal Amount (₹)</Label>
          <Input
            id="ci-principal"
            type="number"
            placeholder="Enter principal amount"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ci-rate">Interest Rate (% per annum)</Label>
          <Input
            id="ci-rate"
            type="number"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ci-time">Time Period (years)</Label>
          <Input
            id="ci-time"
            type="number"
            placeholder="Enter time period"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ci-frequency">Compounding Frequency (times per year)</Label>
          <Input
            id="ci-frequency"
            type="number"
            placeholder="1 = annually, 4 = quarterly, 12 = monthly"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>
        <Button onClick={calculateCompoundInterest} className="w-full">
          Calculate Compound Interest
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
                <span className="text-sm font-medium">Compound Interest</span>
                <span className="text-lg font-semibold text-success">
                  {formatIndianCurrency(result.compoundInterest)}
                </span>
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

export default CompoundInterestCalculator;
