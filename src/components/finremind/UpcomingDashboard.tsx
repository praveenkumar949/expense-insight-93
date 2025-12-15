import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, Shield, Repeat, IndianRupee, CheckCircle, AlertTriangle } from "lucide-react";
import { Reminder, Policy, Subscription } from "@/hooks/useReminders";
import { format, differenceInDays, isAfter, isBefore, addDays } from "date-fns";

interface UpcomingDashboardProps {
  reminders: Reminder[];
  policies: Policy[];
  subscriptions: Subscription[];
  monthlyCommitments: number;
  onMarkPaid: (id: string) => void;
}

export const UpcomingDashboard = ({
  reminders,
  policies,
  subscriptions,
  monthlyCommitments,
  onMarkPaid
}: UpcomingDashboardProps) => {
  const today = new Date();
  const next7Days = addDays(today, 7);
  const next15Days = addDays(today, 15);
  const next30Days = addDays(today, 30);

  // Combine all upcoming items
  const getAllUpcoming = (daysAhead: number) => {
    const futureDate = addDays(today, daysAhead);
    
    const upcomingReminders = reminders
      .filter(r => {
        const dueDate = new Date(r.due_date);
        return r.is_active && !r.is_paid && isBefore(dueDate, futureDate) && isAfter(dueDate, addDays(today, -1));
      })
      .map(r => ({ ...r, type: 'reminder' as const, date: r.due_date }));

    const upcomingPolicies = policies
      .filter(p => {
        const dueDate = new Date(p.due_date);
        return p.is_active && isBefore(dueDate, futureDate) && isAfter(dueDate, addDays(today, -1));
      })
      .map(p => ({ ...p, type: 'policy' as const, date: p.due_date, title: p.policy_name }));

    const upcomingSubscriptions = subscriptions
      .filter(s => {
        const billingDate = new Date(s.billing_date);
        return s.is_active && isBefore(billingDate, futureDate) && isAfter(billingDate, addDays(today, -1));
      })
      .map(s => ({ ...s, type: 'subscription' as const, date: s.billing_date, title: s.name }));

    return [...upcomingReminders, ...upcomingPolicies, ...upcomingSubscriptions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcoming7 = getAllUpcoming(7);
  const autoDebits = [...reminders.filter(r => r.is_auto_debit && r.is_active), 
                      ...subscriptions.filter(s => s.is_auto_debit && s.is_active)];

  const getDaysUntil = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return `${days} days`;
  };

  const getUrgencyColor = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days < 0) return 'destructive';
    if (days <= 3) return 'default';
    if (days <= 7) return 'secondary';
    return 'outline';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <Shield className="h-4 w-4" />;
      case 'subscription': return <Repeat className="h-4 w-4" />;
      default: return <CalendarDays className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next 7 Days</p>
                <p className="text-2xl font-bold">{upcoming7.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <IndianRupee className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Commit</p>
                <p className="text-2xl font-bold">₹{monthlyCommitments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto-Debits</p>
                <p className="text-2xl font-bold">{autoDebits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold">{policies.filter(p => p.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Upcoming Payments (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming7.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming payments in the next 7 days</p>
          ) : (
            <div className="space-y-3">
              {upcoming7.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-background">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                        <Badge variant={getUrgencyColor(item.date)} className="text-xs">
                          {getDaysUntil(item.date)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {'amount' in item && item.amount && (
                      <span className="font-semibold">₹{Number(item.amount).toLocaleString()}</span>
                    )}
                    {'premium_amount' in item && (
                      <span className="font-semibold">₹{Number(item.premium_amount).toLocaleString()}</span>
                    )}
                    {item.type === 'reminder' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkPaid(item.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
