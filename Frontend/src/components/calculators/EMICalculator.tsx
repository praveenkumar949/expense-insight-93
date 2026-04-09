import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const EMICalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [result, setResult] = useState<{
    emi: number;
    totalAmount: number;
    totalInterest: number;
    chartData: Array<{ name: string; value: number }>;
  } | null>(null);

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - p;

      setResult({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        chartData: [
          { name: "Principal", value: Math.round(p) },
          { name: "Interest", value: Math.round(totalInterest) },
        ],
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>Calculate your monthly loan payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="principal">Loan Amount (₹)</Label>
          <Input
            id="principal"
            type="number"
            placeholder="Enter loan amount"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate">Interest Rate (% per annum)</Label>
          <Input
            id="rate"
            type="number"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tenure">Loan Tenure (months)</Label>
          <Input
            id="tenure"
            type="number"
            placeholder="Enter tenure in months"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>
        <Button onClick={calculateEMI} className="w-full">
          Calculate EMI
        </Button>

        {result && (
          <>
            <div className="space-y-3 rounded-lg border bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly EMI</span>
                <span className="text-xl font-bold text-primary">{formatIndianCurrency(result.emi)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Amount Payable</span>
                <span className="text-lg font-semibold">{formatIndianCurrency(result.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Interest</span>
                <span className="text-lg font-semibold">{formatIndianCurrency(result.totalInterest)}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Loan Breakdown</h4>
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
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--chart-wants))"} />
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

export default EMICalculator;
