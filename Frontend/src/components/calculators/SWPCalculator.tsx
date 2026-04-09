import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const SWPCalculator = () => {
  const [investment, setInvestment] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  const calculateSWP = () => {
    const monthlyRate = returnRate / 12 / 100;
    const totalMonths = years * 12;
    let balance = investment;
    let totalWithdrawn = 0;

    for (let i = 0; i < totalMonths; i++) {
      totalWithdrawn += withdrawal;
      balance = balance * (1 + monthlyRate) - withdrawal;
      if (balance <= 0) break;
    }

    const finalBalance = Math.max(balance, 0);
    
    return {
      totalWithdrawn,
      finalBalance,
      totalInvestment: investment,
    };
  };

  const result = calculateSWP();

  const chartData = [
    { name: "Total Withdrawn", value: result.totalWithdrawn, color: "#10b981" },
    { name: "Final Balance", value: result.finalBalance, color: "#3b82f6" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Systematic Withdrawal Plan (SWP) Calculator</CardTitle>
        <CardDescription>Calculate your monthly withdrawals from investments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="swp-investment">Initial Investment (₹)</Label>
            <Input
              id="swp-investment"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swp-withdrawal">Monthly Withdrawal (₹)</Label>
            <Input
              id="swp-withdrawal"
              type="number"
              value={withdrawal}
              onChange={(e) => setWithdrawal(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swp-return">Expected Return Rate (%)</Label>
            <Input
              id="swp-return"
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swp-years">Withdrawal Period (Years)</Label>
            <Input
              id="swp-years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Initial Investment</p>
              <p className="text-2xl font-bold">{formatCurrency(result.totalInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalWithdrawn)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Final Balance</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.finalBalance)}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
  );
};

export default SWPCalculator;