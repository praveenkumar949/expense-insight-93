import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatIndianCurrency } from "@/lib/csvExport";

interface SavingsGoal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

const SavingsGoalsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
    target_date: "",
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["savings-goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavingsGoal[];
    },
    enabled: !!user,
  });

  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: any) => {
      const { error } = await supabase.from("savings_goals").insert(newGoal);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
      toast({ title: "Goal Added", description: "Your savings goal has been created" });
      setOpen(false);
      setFormData({ goal_name: "", target_amount: "", current_amount: "", target_date: "" });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from("savings_goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
      toast({ title: "Goal Deleted", description: "Savings goal removed" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoalMutation.mutate({
      user_id: user?.id,
      goal_name: formData.goal_name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      target_date: formData.target_date || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Savings Goals
            </CardTitle>
            <CardDescription>Track your financial targets</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Savings Goal</DialogTitle>
                <DialogDescription>Set a new financial goal to track</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal_name">Goal Name</Label>
                  <Input
                    id="goal_name"
                    placeholder="e.g., Buy a Laptop"
                    value={formData.goal_name}
                    onChange={(e) => setFormData({ ...formData, goal_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_amount">Target Amount (₹)</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    placeholder="60000"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_amount">Current Amount (₹)</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    placeholder="0"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_date">Target Date (Optional)</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addGoalMutation.isPending}>
                  {addGoalMutation.isPending ? "Adding..." : "Add Goal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No savings goals yet. Add your first goal!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              return (
                <div key={goal.id} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{goal.goal_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatIndianCurrency(goal.current_amount)} of {formatIndianCurrency(goal.target_amount)}
                      </p>
                      {goal.target_date && (
                        <p className="text-xs text-muted-foreground">
                          Target: {new Date(goal.target_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoalMutation.mutate(goal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{progress.toFixed(0)}% Complete</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} />
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

export default SavingsGoalsSection;