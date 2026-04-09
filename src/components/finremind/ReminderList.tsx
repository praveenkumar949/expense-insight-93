import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, Trash2, CheckCircle, Edit, CreditCard, TrendingUp, Shield, 
  Repeat, Zap, MoreVertical, Pause, Play 
} from "lucide-react";
import { Reminder } from "@/hooks/useReminders";
import { ReminderDialog } from "./ReminderDialog";
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

interface ReminderListProps {
  reminders: Reminder[];
  onUpdate: (id: string, updates: Partial<Reminder>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onMarkPaid: (id: string) => Promise<boolean>;
  onAdd: (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_notified_at'>) => Promise<any>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  bill: <Zap className="h-4 w-4" />,
  emi: <CreditCard className="h-4 w-4" />,
  sip: <TrendingUp className="h-4 w-4" />,
  insurance: <Shield className="h-4 w-4" />,
  subscription: <Repeat className="h-4 w-4" />,
  auto_debit: <CreditCard className="h-4 w-4" />,
  investment: <TrendingUp className="h-4 w-4" />,
  custom: <Bell className="h-4 w-4" />
};

const categoryLabels: Record<string, string> = {
  bill: 'Bill',
  emi: 'EMI',
  sip: 'SIP',
  insurance: 'Insurance',
  subscription: 'Subscription',
  auto_debit: 'Auto Debit',
  investment: 'Investment',
  custom: 'Custom'
};

export const ReminderList = ({ reminders, onUpdate, onDelete, onMarkPaid, onAdd }: ReminderListProps) => {
  const today = new Date();

  const getDaysUntil = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return `${Math.abs(days)}d overdue`;
    return `${days}d`;
  };

  const getUrgencyColor = (date: string, isPaid: boolean) => {
    if (isPaid) return 'outline';
    const days = differenceInDays(new Date(date), today);
    if (days < 0) return 'destructive';
    if (days <= 3) return 'default';
    if (days <= 7) return 'secondary';
    return 'outline';
  };

  const activeReminders = reminders.filter(r => r.is_active && !r.is_paid);
  const paidReminders = reminders.filter(r => r.is_paid);
  const pausedReminders = reminders.filter(r => !r.is_active && !r.is_paid);

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg border ${
        reminder.is_paid ? 'bg-muted/30 opacity-60' : 'bg-card hover:bg-muted/50'
      } transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${reminder.is_paid ? 'bg-green-500/10' : 'bg-primary/10'}`}>
          {reminder.is_paid ? <CheckCircle className="h-4 w-4 text-green-500" /> : categoryIcons[reminder.category]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className={`font-medium ${reminder.is_paid ? 'line-through' : ''}`}>{reminder.title}</p>
            {reminder.is_auto_debit && (
              <Badge variant="outline" className="text-xs">Auto</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{categoryLabels[reminder.category]}</Badge>
            <span>{format(new Date(reminder.due_date), 'MMM dd')}</span>
            <Badge variant={getUrgencyColor(reminder.due_date, reminder.is_paid)} className="text-xs">
              {reminder.is_paid ? 'Paid' : getDaysUntil(reminder.due_date)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {reminder.amount && (
          <span className="font-semibold mr-2">₹{reminder.amount.toLocaleString()}</span>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!reminder.is_paid && (
              <DropdownMenuItem onClick={() => onMarkPaid(reminder.id)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onUpdate(reminder.id, { is_active: !reminder.is_active })}>
              {reminder.is_active ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </DropdownMenuItem>
            <ReminderDialog 
              reminder={reminder}
              onSave={async (data) => {
                await onUpdate(reminder.id, data);
              }}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{reminder.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(reminder.id)}>Delete</AlertDialogAction>
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
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Reminders
        </CardTitle>
        <ReminderDialog onSave={onAdd} />
      </CardHeader>
      <CardContent className="space-y-4">
        {activeReminders.length === 0 && paidReminders.length === 0 && pausedReminders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reminders yet. Add your first reminder!</p>
        ) : (
          <>
            {activeReminders.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Active ({activeReminders.length})</h4>
                {activeReminders.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            )}

            {pausedReminders.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Paused ({pausedReminders.length})</h4>
                {pausedReminders.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            )}

            {paidReminders.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Completed ({paidReminders.length})</h4>
                {paidReminders.slice(0, 5).map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
