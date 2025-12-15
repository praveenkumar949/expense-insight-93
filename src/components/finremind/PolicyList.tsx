import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Trash2, Edit, MoreVertical, Heart, Car, Home, Plane, User } from "lucide-react";
import { Policy } from "@/hooks/useReminders";
import { PolicyDialog } from "./PolicyDialog";
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

interface PolicyListProps {
  policies: Policy[];
  onUpdate: (id: string, updates: Partial<Policy>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAdd: (policy: Omit<Policy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
}

const policyIcons: Record<string, React.ReactNode> = {
  health: <Heart className="h-4 w-4" />,
  term: <User className="h-4 w-4" />,
  vehicle: <Car className="h-4 w-4" />,
  life: <User className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  travel: <Plane className="h-4 w-4" />,
  other: <Shield className="h-4 w-4" />
};

const policyLabels: Record<string, string> = {
  health: 'Health',
  term: 'Term',
  vehicle: 'Vehicle',
  life: 'Life',
  home: 'Home',
  travel: 'Travel',
  other: 'Other'
};

const frequencyLabels: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  half_yearly: 'Half Yearly',
  yearly: 'Yearly'
};

export const PolicyList = ({ policies, onUpdate, onDelete, onAdd }: PolicyListProps) => {
  const today = new Date();

  const getDaysUntil = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    if (days < 0) return `${Math.abs(days)}d overdue`;
    return `${days}d left`;
  };

  const getUrgencyColor = (date: string) => {
    const days = differenceInDays(new Date(date), today);
    if (days < 0) return 'destructive';
    if (days <= 7) return 'default';
    if (days <= 30) return 'secondary';
    return 'outline';
  };

  const activePolicies = policies.filter(p => p.is_active);
  const inactivePolicies = policies.filter(p => !p.is_active);

  const PolicyCard = ({ policy }: { policy: Policy }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          {policyIcons[policy.policy_type]}
        </div>
        <div>
          <p className="font-medium">{policy.policy_name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{policyLabels[policy.policy_type]}</Badge>
            {policy.provider && <span>• {policy.provider}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{frequencyLabels[policy.renewal_frequency]}</span>
            <span>•</span>
            <span>Due: {format(new Date(policy.due_date), 'MMM dd, yyyy')}</span>
            <Badge variant={getUrgencyColor(policy.due_date)} className="text-xs">
              {getDaysUntil(policy.due_date)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right mr-2">
          <p className="font-semibold">₹{policy.premium_amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{frequencyLabels[policy.renewal_frequency]}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PolicyDialog 
              policy={policy}
              onSave={async (data) => {
                await onUpdate(policy.id, data);
              }}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem onClick={() => onUpdate(policy.id, { is_active: !policy.is_active })}>
              {policy.is_active ? 'Deactivate' : 'Activate'}
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
                  <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{policy.policy_name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(policy.id)}>Delete</AlertDialogAction>
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
          <Shield className="h-5 w-5" />
          Insurance & Policies
        </CardTitle>
        <PolicyDialog onSave={onAdd} />
      </CardHeader>
      <CardContent className="space-y-4">
        {activePolicies.length === 0 && inactivePolicies.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No policies added yet. Track your insurance policies!</p>
        ) : (
          <>
            {activePolicies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Active ({activePolicies.length})</h4>
                {activePolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            )}

            {inactivePolicies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Inactive ({inactivePolicies.length})</h4>
                {inactivePolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
