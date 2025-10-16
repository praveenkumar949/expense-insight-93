import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const FDCalculator = () => {
  const [principal, setPrincipal] = useState<string>("100000");
  const [rate, setRate] = useState<string>("7");
  const [tenure, setTenure] = useState<string>("5");
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("4"); // Quarterly

  const calculateFD = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) / 100 || 0;
    const t = parseFloat(tenure) || 0;
    const n = parseFloat(compoundingFrequency) || 4;

    // FD formula: A = P(1 + r/n)^(nt)
    const maturityAmount = p * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - p;

    return {
      maturityAmount: Math.round(maturityAmount),
      investedAmount: p,
      interestEarned: Math.round(interestEarned),
    };
  };

  const result = calculateFD();

  const pieData = [
    { name: "Principal", value: result.investedAmount, color: "#8b5cf6" },
    { name: "Interest", value: result.interestEarned, color: "#10b981" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fixed Deposit Calculator
          </CardTitle>
          <CardDescription>Calculate returns on your Fixed Deposit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fd-principal">Principal Amount (₹)</Label>
            <Input
              id="fd-principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="100000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fd-rate">Interest Rate (% per annum)</Label>
            <Input
              id="fd-rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="7"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fd-tenure">Tenure (Years)</Label>
            <Input
              id="fd-tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fd-frequency">Compounding Frequency</Label>
            <select
              id="fd-frequency"
              value={compoundingFrequency}
              onChange={(e) => setCompoundingFrequency(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="1">Annually</option>
              <option value="2">Half-Yearly</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>

          <Button
            onClick={() => {
              setPrincipal("100000");
              setRate("7");
              setTenure("5");
              setCompoundingFrequency("4");
            }}
            variant="outline"
            className="w-full"
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Your FD maturity details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Principal Amount</span>
              <span className="font-bold">{formatCurrency(result.investedAmount)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Interest Earned</span>
              <span className="font-bold text-green-600">{formatCurrency(result.interestEarned)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">Maturity Amount</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(result.maturityAmount)}</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FDCalculator;
