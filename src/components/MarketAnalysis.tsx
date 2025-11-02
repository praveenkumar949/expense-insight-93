import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface MarketData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Mock data - In production, this would fetch from a real API
const fetchMarketData = async (): Promise<MarketData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { name: "Nifty 50", value: 21453.95, change: 125.30, changePercent: 0.59 },
    { name: "Sensex 30", value: 71060.31, change: 421.25, changePercent: 0.60 },
    { name: "Gold (₹/10g)", value: 63250, change: -150, changePercent: -0.24 },
    { name: "Silver (₹/kg)", value: 74800, change: 320, changePercent: 0.43 },
    { name: "Nifty Bank", value: 46789.45, change: -89.20, changePercent: -0.19 },
  ];
};

const MarketAnalysis = () => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market-data"],
    queryFn: fetchMarketData,
    refetchInterval: 60000, // Refetch every minute
  });

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Daily Market Analysis
        </CardTitle>
        <CardDescription>Real-time insights on major indices and assets</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {marketData?.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-2xl font-bold">
                    {item.value.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getTrendIcon(item.change)}
                    <span className={`text-sm font-semibold ${getTrendColor(item.change)}`}>
                      {item.change > 0 ? "+" : ""}
                      {item.change.toFixed(2)}
                    </span>
                  </div>
                  <span className={`text-sm ${getTrendColor(item.change)}`}>
                    ({item.changePercent > 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Data updates every minute. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default MarketAnalysis;
