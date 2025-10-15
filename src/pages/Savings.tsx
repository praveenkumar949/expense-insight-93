import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSavings } from "@/hooks/useSavings";
import { formatIndianCurrency } from "@/lib/csvExport";
import { format } from "date-fns";
import { Trash2, PiggyBank, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SavingsGoalsSection from "@/components/SavingsGoalsSection";
import SavingsInsightsSection from "@/components/SavingsInsightsSection";

const Savings = () => {
  const { savings, addSavings, deleteSavings, totalSavings } = useSavings();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !source) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and source",
        variant: "destructive",
      });
      return;
    }

    addSavings({
      date: new Date(),
      amount: parseFloat(amount),
      source,
      description: description || undefined,
    });

    setAmount("");
    setSource("");
    setDescription("");

    toast({
      title: "Savings Added",
      description: "Your savings entry has been recorded",
    });
  };

  const handleDelete = (id: string) => {
    deleteSavings(id);
    toast({
      title: "Savings Deleted",
      description: "The savings entry has been removed",
    });
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Savings Tracker</h1>
        <p className="text-muted-foreground">Track all your savings in one place</p>
      </div>

      {/* Total Savings Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {formatIndianCurrency(totalSavings)}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <div className="mb-6">
        <SavingsGoalsSection />
      </div>

      {/* Savings Insights & Trends */}
      <div className="mb-6">
        <SavingsInsightsSection />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Savings Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Savings</CardTitle>
            <CardDescription>Record your savings entries</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Salary, Bonus, Investment Returns"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this savings"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Savings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Savings History */}
        <Card>
          <CardHeader>
            <CardTitle>Savings History</CardTitle>
            <CardDescription>View all your savings entries</CardDescription>
          </CardHeader>
          <CardContent>
            {savings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No savings recorded yet</p>
                <p className="text-sm text-muted-foreground">Start tracking your savings today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savings
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{formatIndianCurrency(entry.amount)}</p>
                          <span className="text-sm text-muted-foreground">•</span>
                          <p className="text-sm font-medium">{entry.source}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(entry.date, "dd MMM yyyy")}
                        </p>
                        {entry.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Savings;
