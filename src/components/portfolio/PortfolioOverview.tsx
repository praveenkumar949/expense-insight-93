import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { formatIndianCurrency } from "@/lib/csvExport";
import { PortfolioSummary } from "@/hooks/usePortfolio";

interface PortfolioOverviewProps {
  summary: PortfolioSummary;
}

const PortfolioOverview = ({ summary }: PortfolioOverviewProps) => {
  const isProfit = summary.overallGainLoss >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatIndianCurrency(summary.totalInvested)}</div>
          <p className="text-xs text-muted-foreground">
            Across all investments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatIndianCurrency(summary.currentValue)}</div>
          <p className="text-xs text-muted-foreground">
            Portfolio market value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Returns</CardTitle>
          {isProfit ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isProfit ? "+" : ""}{formatIndianCurrency(summary.overallGainLoss)}
          </div>
          <p className={`text-xs ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isProfit ? "+" : ""}{summary.overallGainLossPercent.toFixed(2)}% overall
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gain/Loss %</CardTitle>
          {isProfit ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isProfit ? "+" : ""}{summary.overallGainLossPercent.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {isProfit ? "Profit" : "Loss"} on investment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
