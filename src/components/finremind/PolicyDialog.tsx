import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { Policy } from "@/hooks/useReminders";

interface PolicyDialogProps {
  policy?: Policy;
  onSave: (policy: Omit<Policy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
  trigger?: React.ReactNode;
}

const policyTypes = [
  { value: 'health', label: 'Health Insurance' },
  { value: 'term', label: 'Term Insurance' },
  { value: 'vehicle', label: 'Vehicle Insurance' },
  { value: 'life', label: 'Life Insurance' },
  { value: 'home', label: 'Home Insurance' },
  { value: 'travel', label: 'Travel Insurance' },
  { value: 'other', label: 'Other' }
];

const renewalFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'yearly', label: 'Yearly' }
];

export const PolicyDialog = ({ policy, onSave, trigger }: PolicyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policy_name: policy?.policy_name || '',
    policy_number: policy?.policy_number || '',
    policy_type: (policy?.policy_type || 'health') as Policy['policy_type'],
    premium_amount: policy?.premium_amount?.toString() || '',
    due_date: policy?.due_date || new Date().toISOString().split('T')[0],
    renewal_frequency: (policy?.renewal_frequency || 'yearly') as Policy['renewal_frequency'],
    expiry_date: policy?.expiry_date || '',
    provider: policy?.provider || '',
    notes: policy?.notes || '',
    is_active: policy?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSave({
      policy_name: formData.policy_name,
      policy_number: formData.policy_number || null,
      policy_type: formData.policy_type as Policy['policy_type'],
      premium_amount: parseFloat(formData.premium_amount),
      due_date: formData.due_date,
      renewal_frequency: formData.renewal_frequency as Policy['renewal_frequency'],
      expiry_date: formData.expiry_date || null,
      provider: formData.provider || null,
      notes: formData.notes || null,
      is_active: formData.is_active
    });

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            {policy ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {policy ? 'Edit' : 'Add Policy'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{policy ? 'Edit Policy' : 'Add New Policy'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="policy_name">Policy Name *</Label>
            <Input
              id="policy_name"
              value={formData.policy_name}
              onChange={(e) => setFormData({ ...formData, policy_name: e.target.value })}
              placeholder="e.g., Health Insurance - Family"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="policy_type">Type *</Label>
              <Select
                value={formData.policy_type}
                onValueChange={(value) => setFormData({ ...formData, policy_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {policyTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="policy_number">Policy Number</Label>
              <Input
                id="policy_number"
                value={formData.policy_number}
                onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="premium_amount">Premium (₹) *</Label>
              <Input
                id="premium_amount"
                type="number"
                value={formData.premium_amount}
                onChange={(e) => setFormData({ ...formData, premium_amount: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="renewal_frequency">Renewal</Label>
              <Select
                value={formData.renewal_frequency}
                onValueChange={(value) => setFormData({ ...formData, renewal_frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {renewalFrequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              placeholder="e.g., LIC, HDFC Ergo"
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

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : (policy ? 'Update Policy' : 'Add Policy')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
