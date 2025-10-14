import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/csvExport";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const InflationCalculator = () => {
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [inflationRate, setInflationRate] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [result, setResult] = useState<{
    futureValue: number;
    chartData: Array<{ year: string; value: number }>;
  } | null>(null);

  const calculateInflation = () => {
    const p = parseFloat(currentPrice);
    const r = parseFloat(inflationRate) / 100;
    const n = parseInt(years);

    if (p && r && n) {
      const futureValue = p * Math.pow(1 + r, n);
      
      // Generate chart data for each year
      const chartData = Array.from({ length: n + 1 }, (_, i) => ({
        year: `Year ${i}`,
        value: Math.round(p * Math.pow(1 + r, i)),
      }));

      setResult({
        futureValue: Math.round(futureValue),
        chartData,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inflation Calculator</CardTitle>
        <CardDescription>Calculate future cost with inflation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-price">Current Price (₹)</Label>
          <Input
            id="current-price"
            type="number"
            placeholder="Enter current price"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inflation-rate">Inflation Rate (% per annum)</Label>
          <Input
            id="inflation-rate"
            type="number"
            placeholder="Enter inflation rate"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years">Time Period (years)</Label>
          <Input
            id="years"
            type="number"
            placeholder="Enter number of years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <Button onClick={calculateInflation} className="w-full">
          Calculate Future Value
        </Button>

        {result && (
          <>
            <div className="space-y-3 rounded-lg border bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Future Value</span>
                <span className="text-xl font-bold text-primary">{formatIndianCurrency(result.futureValue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Price</span>
                <span className="text-lg font-semibold">{formatIndianCurrency(parseFloat(currentPrice))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Increase</span>
                <span className="text-lg font-semibold text-destructive">
                  {formatIndianCurrency(result.futureValue - parseFloat(currentPrice))}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Inflation Growth Over Time</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Value (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InflationCalculator;
