import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repeat, Trash2, Edit, MoreVertical, Tv, Zap, Dumbbell, Wifi, Smartphone, Cloud, AppWindow } from "lucide-react";
import { Subscription } from "@/hooks/useReminders";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { format, differenceInDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onUpdate: (id: string, updates: Partial<Subscription>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAdd: (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  ott: <Tv className="h-4 w-4" />,
  utility: <Zap className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  internet: <Wifi className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  cloud: <Cloud className="h-4 w-4" />,
  software: <AppWindow className="h-4 w-4" />,
  other: <Repeat className="h-4 w-4" />
};

const categoryLabels: Record<string, string> = {
  ott: 'OTT',
  utility: 'Utility',
  gym: 'Gym',
  internet: 'Internet',
  mobile: 'Mobile',
  cloud: 'Cloud',
  software: 'Software',
  other: 'Other'
};

const frequencyLabels: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly'
};

export const SubscriptionList = ({ subscriptions, onUpdate, onDelete, onAdd }: SubscriptionListProps) => {
  const today = new Date();

  const getDaysUntil = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return `${Math.abs(days)}d ago`;
    return `${days}d`;
  };

  const getUrgencyColor = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days < 0) return 'destructive';
    if (days <= 3) return 'default';
    if (days <= 7) return 'secondary';
    return 'outline';
  };

  const activeSubscriptions = subscriptions.filter(s => s.is_active);
  const inactiveSubscriptions = subscriptions.filter(s => !s.is_active);

  // Calculate monthly total
  const monthlyTotal = activeSubscriptions.reduce((sum, s) => {
    switch (s.frequency) {
      case 'weekly': return sum + (s.amount * 4);
      case 'monthly': return sum + s.amount;
      case 'quarterly': return sum + (s.amount / 3);
      case 'yearly': return sum + (s.amount / 12);
      default: return sum + s.amount;
    }
  }, 0);

  const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          {categoryIcons[subscription.category]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{subscription.name}</p>
            {subscription.is_auto_debit && (
              <Badge variant="outline" className="text-xs">Auto</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{categoryLabels[subscription.category]}</Badge>
            {subscription.provider && <span>• {subscription.provider}</span>}
            <span>• {frequencyLabels[subscription.frequency]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Next: {format(new Date(subscription.billing_date), 'MMM dd')}</span>
            <Badge variant={getUrgencyColor(subscription.billing_date)} className="text-xs">
              {getDaysUntil(subscription.billing_date)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold mr-2">₹{subscription.amount.toLocaleString()}</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <SubscriptionDialog 
              subscription={subscription}
              onSave={async (data) => {
                await onUpdate(subscription.id, data);
              }}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem onClick={() => onUpdate(subscription.id, { is_active: !subscription.is_active })}>
              {subscription.is_active ? 'Pause' : 'Resume'}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(subscription.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Subscriptions & Bills
          </CardTitle>
          {activeSubscriptions.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Monthly estimate: ₹{Math.round(monthlyTotal).toLocaleString()}
            </p>
          )}
        </div>
        <SubscriptionDialog onSave={onAdd} />
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSubscriptions.length === 0 && inactiveSubscriptions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No subscriptions added yet. Track your recurring bills!</p>
        ) : (
          <>
            {activeSubscriptions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Active ({activeSubscriptions.length})</h4>
                {activeSubscriptions.map(subscription => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            )}

            {inactiveSubscriptions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Paused ({inactiveSubscriptions.length})</h4>
                {inactiveSubscriptions.map(subscription => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
