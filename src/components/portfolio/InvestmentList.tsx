import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Investment } from "@/hooks/usePortfolio";
import { formatIndianCurrency } from "@/lib/csvExport";
import { Edit, Trash2, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { format } from "date-fns";

interface InvestmentListProps {
  investments: Investment[];
  title: string;
  description?: string;
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  emptyMessage?: string;
}

const categoryLabels: Record<string, string> = {
  mutual_fund: "Mutual Fund",
  stock: "Stock",
  crypto: "Crypto",
  gold: "Gold",
  etf: "ETF",
  cash: "Cash",
};

const InvestmentList = ({ 
  investments, 
  title, 
  description, 
  onEdit, 
  onDelete, 
  onAdd,
  emptyMessage = "No investments in this category yet."
}: InvestmentListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {investments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => {
              const returns = investment.current_value - investment.invested_amount;
              const returnsPercent = investment.invested_amount > 0 
                ? (returns / investment.invested_amount) * 100 
                : 0;
              const isProfit = returns >= 0;

              return (
                <div
                  key={investment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{investment.name}</h4>
                      <Badge variant={investment.status === "active" ? "default" : "secondary"}>
                        {investment.status}
                      </Badge>
                      {investment.sub_category && (
                        <Badge variant="outline">{investment.sub_category}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{categoryLabels[investment.category]}</span>
                      <span>Bought: {format(new Date(investment.purchase_date), "dd MMM yyyy")}</span>
                      {investment.units && <span>Units: {investment.units}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="font-medium">{formatIndianCurrency(investment.invested_amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="font-medium">{formatIndianCurrency(investment.current_value)}</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="flex items-center justify-end gap-1">
                        {isProfit ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {isProfit ? "+" : ""}{returnsPercent.toFixed(1)}%
                        </span>
                      </div>
                      <p className={`text-sm ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {isProfit ? "+" : ""}{formatIndianCurrency(returns)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(investment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(investment.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentList;
