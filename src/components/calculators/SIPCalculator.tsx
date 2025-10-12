import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [result, setResult] = useState<{
    maturityAmount: number;
    investedAmount: number;
    returns: number;
  } | null>(null);

  const calculateSIP = () => {
    const p = parseFloat(monthlyInvestment);
    const r = parseFloat(expectedReturn) / 12 / 100;
    const n = parseFloat(timePeriod) * 12;

    if (p && r && n) {
      const maturityAmount = p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const investedAmount = p * n;
      const returns = maturityAmount - investedAmount;

      setResult({
        maturityAmount: Math.round(maturityAmount),
        investedAmount: Math.round(investedAmount),
        returns: Math.round(returns),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIP Calculator</CardTitle>
        <CardDescription>Calculate returns on your Systematic Investment Plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthly">Monthly Investment (₹)</Label>
          <Input
            id="monthly"
            type="number"
            placeholder="Enter monthly investment"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(e.target.value)}
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
        <Button onClick={calculateSIP} className="w-full">
          Calculate SIP Returns
        </Button>

        {result && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default SIPCalculator;
