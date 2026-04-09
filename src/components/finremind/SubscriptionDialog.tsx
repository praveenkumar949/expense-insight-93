import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { Subscription } from "@/hooks/useReminders";

interface SubscriptionDialogProps {
  subscription?: Subscription;
  onSave: (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
  trigger?: React.ReactNode;
}

const subscriptionCategories = [
  { value: 'ott', label: 'OTT (Netflix, Prime, etc.)' },
  { value: 'utility', label: 'Utility (Electricity, Water, Gas)' },
  { value: 'gym', label: 'Gym / Fitness' },
  { value: 'internet', label: 'Internet / Broadband' },
  { value: 'mobile', label: 'Mobile / Postpaid' },
  { value: 'cloud', label: 'Cloud Storage' },
  { value: 'software', label: 'Software / Apps' },
  { value: 'other', label: 'Other' }
];

const frequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const SubscriptionDialog = ({ subscription, onSave, trigger }: SubscriptionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: subscription?.name || '',
    category: (subscription?.category || 'ott') as Subscription['category'],
    amount: subscription?.amount?.toString() || '',
    billing_date: subscription?.billing_date || new Date().toISOString().split('T')[0],
    frequency: (subscription?.frequency || 'monthly') as Subscription['frequency'],
    is_auto_debit: subscription?.is_auto_debit ?? false,
    is_active: subscription?.is_active ?? true,
    provider: subscription?.provider || '',
    notes: subscription?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSave({
      name: formData.name,
      category: formData.category as Subscription['category'],
      amount: parseFloat(formData.amount),
      billing_date: formData.billing_date,
      frequency: formData.frequency as Subscription['frequency'],
      is_auto_debit: formData.is_auto_debit,
      is_active: formData.is_active,
      provider: formData.provider || null,
      notes: formData.notes || null
    });

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            {subscription ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {subscription ? 'Edit' : 'Add Subscription'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Netflix, Electricity"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Subscription['category'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subscriptionCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value as Subscription['frequency'] })}
            >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="billing_date">Billing Date *</Label>
            <Input
              id="billing_date"
              type="date"
              value={formData.billing_date}
              onChange={(e) => setFormData({ ...formData, billing_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="e.g., Netflix, Jio"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_auto_debit">Auto-Debit Enabled</Label>
              <Switch
                id="is_auto_debit"
                checked={formData.is_auto_debit}
                onCheckedChange={(checked) => setFormData({ ...formData, is_auto_debit: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : (subscription ? 'Update Subscription' : 'Add Subscription')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
