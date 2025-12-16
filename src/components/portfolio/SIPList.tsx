import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SIPInvestment } from "@/hooks/usePortfolio";
import { formatIndianCurrency } from "@/lib/csvExport";
import { Edit, Trash2, TrendingUp, TrendingDown, Plus, Calendar, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface SIPListProps {
  sips: SIPInvestment[];
  onEdit: (sip: SIPInvestment) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const SIPList = ({ sips, onEdit, onDelete, onAdd }: SIPListProps) => {
  const activeSIPs = sips.filter(s => s.is_active);
  const totalMonthly = activeSIPs.reduce((sum, s) => sum + Number(s.monthly_amount), 0);
  const totalInvested = sips.reduce((sum, s) => sum + Number(s.total_invested), 0);
  const totalCurrentValue = sips.reduce((sum, s) => sum + Number(s.current_value), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>SIP Investments</CardTitle>
          <CardDescription>
            {activeSIPs.length} active SIPs | Monthly: {formatIndianCurrency(totalMonthly)}
          </CardDescription>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add SIP
        </Button>
      </CardHeader>
      <CardContent>
        {sips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No SIPs added yet. Start a SIP to grow your wealth systematically.
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Active SIPs</p>
                <p className="text-xl font-bold">{activeSIPs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Amount</p>
                <p className="text-xl font-bold">{formatIndianCurrency(totalMonthly)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold">{formatIndianCurrency(totalInvested)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold">{formatIndianCurrency(totalCurrentValue)}</p>
              </div>
            </div>

            {/* SIP List */}
            <div className="space-y-4">
              {sips.map((sip) => {
                const returns = sip.current_value - sip.total_invested;
                const returnsPercent = sip.total_invested > 0 
                  ? (returns / sip.total_invested) * 100 
                  : 0;
                const isProfit = returns >= 0;
                const daysToNext = differenceInDays(new Date(sip.next_sip_date), new Date());

                return (
                  <div
                    key={sip.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{sip.fund_name}</h4>
                        <Badge variant={sip.is_active ? "default" : "secondary"}>
                          {sip.is_active ? "Active" : "Paused"}
                        </Badge>
                        {sip.category && (
                          <Badge variant="outline">{sip.category}</Badge>
                        )}
                        {sip.missed_count > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {sip.missed_count} Missed
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {sip.sip_date_of_month}th of every month
                        </span>
                        <span>Started: {format(new Date(sip.start_date), "dd MMM yyyy")}</span>
                        {daysToNext >= 0 && daysToNext <= 7 && (
                          <span className="text-amber-600 dark:text-amber-400">
                            Next SIP in {daysToNext} day{daysToNext !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="font-medium">{formatIndianCurrency(sip.monthly_amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Invested</p>
                        <p className="font-medium">{formatIndianCurrency(sip.total_invested)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="font-medium">{formatIndianCurrency(sip.current_value)}</p>
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
                        <Button variant="ghost" size="icon" onClick={() => onEdit(sip)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(sip.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SIPList;
