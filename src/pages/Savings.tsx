import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useSavings } from "@/hooks/useSavings";
import { formatIndianCurrency } from "@/lib/csvExport";
import { format } from "date-fns";
import { Trash2, PiggyBank, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SavingsGoalsSection from "@/components/SavingsGoalsSection";
import SavingsInsightsSection from "@/components/SavingsInsightsSection";
import MonthSelector from "@/components/MonthSelector";

const Savings = () => {
  const { savings, addSavings, deleteSavings, totalSavings } = useSavings();
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  
  // Get available months from savings data
  const availableMonths = Array.from(
    new Set(savings.map((s) => format(s.date, "yyyy-MM")))
  ).sort((a, b) => b.localeCompare(a));

  const { data: goals = [] } = useQuery({
    queryKey: ["savings-goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Update goal if selected
    if (selectedGoalId && user) {
      const selectedGoal = goals.find(g => g.id === selectedGoalId);
      if (selectedGoal) {
        const newAmount = (selectedGoal.current_amount || 0) + parseFloat(amount);
        const { error } = await supabase
          .from("savings_goals")
          .update({ current_amount: newAmount })
          .eq("id", selectedGoalId);

        if (!error) {
          toast({
            title: "Goal Updated",
            description: "Your savings have been added to the selected goal",
          });
        }
      }
    }

    setAmount("");
    setSource("");
    setDescription("");
    setSelectedGoalId("");

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Savings Tracker</h1>
          <p className="text-muted-foreground">Track all your savings in one place</p>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
        />
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
      {/* Add Savings Form - Moved to Top */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Savings</CardTitle>
          <CardDescription>Record your savings entries</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                  placeholder="e.g., Salary, Bonus"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Add to Savings Goal (Optional)</Label>
              <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.goal_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Add Savings
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mb-6">
        <SavingsInsightsSection selectedMonth={selectedMonth} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Savings Goals</CardTitle>
            <CardDescription>Track your savings goals progress</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No savings goals yet. Add one above!
              </p>
            ) : (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => {
                  const progress = goal.target_amount > 0 
                    ? ((goal.current_amount || 0) / goal.target_amount) * 100 
                    : 0;
                  return (
                    <div key={goal.id} className="space-y-2 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{goal.goal_name}</p>
                        <p className="text-sm font-semibold">{progress.toFixed(0)}%</p>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {formatIndianCurrency(goal.current_amount || 0)} / {formatIndianCurrency(goal.target_amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
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
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
