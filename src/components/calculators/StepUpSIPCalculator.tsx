import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";

const StepUpSIPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState<string>("");
  const [stepUpPercent, setStepUpPercent] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [result, setResult] = useState<{
    maturityAmount: number;
    totalInvested: number;
    returns: number;
  } | null>(null);

  const calculateStepUpSIP = () => {
    const initialAmount = parseFloat(initialInvestment);
    const stepUp = parseFloat(stepUpPercent) / 100;
    const r = parseFloat(expectedReturn) / 12 / 100;
    const years = parseFloat(timePeriod);

    if (initialAmount && stepUp >= 0 && r && years) {
      let totalInvested = 0;
      let maturityAmount = 0;
      let currentInvestment = initialAmount;

      for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
          totalInvested += currentInvestment;
          const remainingMonths = (years - year) * 12 - month;
          maturityAmount += currentInvestment * Math.pow(1 + r, remainingMonths);
        }
        currentInvestment = currentInvestment * (1 + stepUp);
      }

      const returns = maturityAmount - totalInvested;

      setResult({
        maturityAmount: Math.round(maturityAmount),
        totalInvested: Math.round(totalInvested),
        returns: Math.round(returns),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step-Up SIP Calculator</CardTitle>
        <CardDescription>Calculate returns with annual step-up investments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="initial">Initial Monthly Investment (₹)</Label>
          <Input
            id="initial"
            type="number"
            placeholder="Enter initial investment"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stepup">Annual Step-Up (%)</Label>
          <Input
            id="stepup"
            type="number"
            placeholder="Enter annual increase percentage"
            value={stepUpPercent}
            onChange={(e) => setStepUpPercent(e.target.value)}
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
        <Button onClick={calculateStepUpSIP} className="w-full">
          Calculate Step-Up SIP
        </Button>

        {result && (
          <div className="space-y-3 rounded-lg border bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Maturity Amount</span>
              <span className="text-xl font-bold text-primary">{formatIndianCurrency(result.maturityAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Invested</span>
              <span className="text-lg font-semibold">{formatIndianCurrency(result.totalInvested)}</span>
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

export default StepUpSIPCalculator;
