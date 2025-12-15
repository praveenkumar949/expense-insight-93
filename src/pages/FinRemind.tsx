import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, Repeat, LayoutDashboard, Download, RefreshCw } from "lucide-react";
import { useReminders } from "@/hooks/useReminders";
import { UpcomingDashboard } from "@/components/finremind/UpcomingDashboard";
import { ReminderList } from "@/components/finremind/ReminderList";
import { PolicyList } from "@/components/finremind/PolicyList";
import { SubscriptionList } from "@/components/finremind/SubscriptionList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const FinRemind = () => {
  const {
    reminders,
    policies,
    subscriptions,
    loading,
    fetchAll,
    addReminder,
    updateReminder,
    deleteReminder,
    markAsPaid,
    addPolicy,
    updatePolicy,
    deletePolicy,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getMonthlyCommitments
  } = useReminders();

  const [activeTab, setActiveTab] = useState("dashboard");

  const handleExport = () => {
    const data = {
      reminders,
      policies,
      subscriptions,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finremind-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 pt-20">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 pt-20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Bell className="h-7 w-7 text-primary" />
                FinRemind
              </h1>
              <p className="text-muted-foreground">
                Never miss a payment, premium, or subscription renewal
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4 hidden sm:inline" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="reminders" className="gap-2">
                <Bell className="h-4 w-4 hidden sm:inline" />
                <span>Reminders</span>
              </TabsTrigger>
              <TabsTrigger value="policies" className="gap-2">
                <Shield className="h-4 w-4 hidden sm:inline" />
                <span>Policies</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2">
                <Repeat className="h-4 w-4 hidden sm:inline" />
                <span>Subscriptions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <UpcomingDashboard
                reminders={reminders}
                policies={policies}
                subscriptions={subscriptions}
                monthlyCommitments={getMonthlyCommitments()}
                onMarkPaid={markAsPaid}
              />
            </TabsContent>

            <TabsContent value="reminders" className="mt-6">
              <ReminderList
                reminders={reminders}
                onUpdate={updateReminder}
                onDelete={deleteReminder}
                onMarkPaid={markAsPaid}
                onAdd={addReminder}
              />
            </TabsContent>

            <TabsContent value="policies" className="mt-6">
              <PolicyList
                policies={policies}
                onUpdate={updatePolicy}
                onDelete={deletePolicy}
                onAdd={addPolicy}
              />
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-6">
              <SubscriptionList
                subscriptions={subscriptions}
                onUpdate={updateSubscription}
                onDelete={deleteSubscription}
                onAdd={addSubscription}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default FinRemind;
