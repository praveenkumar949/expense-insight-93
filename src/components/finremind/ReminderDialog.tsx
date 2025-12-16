import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { Reminder } from "@/hooks/useReminders";

interface ReminderDialogProps {
  reminder?: Reminder;
  onSave: (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_notified_at'>) => Promise<any>;
  trigger?: React.ReactNode;
}

const categories = [
  { value: 'bill', label: 'Bill Payment' },
  { value: 'emi', label: 'EMI' },
  { value: 'sip', label: 'SIP' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'auto_debit', label: 'Auto Debit' },
  { value: 'investment', label: 'Investment' },
  { value: 'custom', label: 'Custom' }
];

const frequencies = [
  { value: 'once', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const ReminderDialog = ({ reminder, onSave, trigger }: ReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    category: (reminder?.category || 'bill') as Reminder['category'],
    amount: reminder?.amount?.toString() || '',
    due_date: reminder?.due_date || new Date().toISOString().split('T')[0],
    frequency: (reminder?.frequency || 'monthly') as Reminder['frequency'],
    reminder_days: reminder?.reminder_days || [1, 3, 7],
    is_active: reminder?.is_active ?? true,
    is_paid: reminder?.is_paid ?? false,
    is_auto_debit: reminder?.is_auto_debit ?? false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSave({
      title: formData.title,
      description: formData.description || null,
      category: formData.category as Reminder['category'],
      amount: formData.amount ? parseFloat(formData.amount) : null,
      due_date: formData.due_date,
      frequency: formData.frequency as Reminder['frequency'],
      reminder_days: formData.reminder_days,
      is_active: formData.is_active,
      is_paid: formData.is_paid,
      is_auto_debit: formData.is_auto_debit
    });

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            {reminder ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {reminder ? 'Edit' : 'Add Reminder'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Electricity Bill"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Reminder['category'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value as Reminder['frequency'] })}
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            {loading ? 'Saving...' : (reminder ? 'Update Reminder' : 'Add Reminder')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
