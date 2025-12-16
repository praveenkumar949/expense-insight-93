import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SIPInvestment } from "@/hooks/usePortfolio";

interface SIPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sip: Omit<SIPInvestment, "id" | "user_id" | "created_at" | "updated_at">) => void;
  sip?: SIPInvestment | null;
}

const SIPDialog = ({ open, onOpenChange, onSave, sip }: SIPDialogProps) => {
  const [formData, setFormData] = useState({
    fund_name: "",
    category: "",
    monthly_amount: 0,
    start_date: new Date().toISOString().split("T")[0],
    next_sip_date: new Date().toISOString().split("T")[0],
    total_invested: 0,
    current_value: 0,
    is_active: true,
    sip_date_of_month: 1,
    missed_count: 0,
    notes: "",
  });

  useEffect(() => {
    if (sip) {
      setFormData({
        fund_name: sip.fund_name,
        category: sip.category || "",
        monthly_amount: sip.monthly_amount,
        start_date: sip.start_date,
        next_sip_date: sip.next_sip_date,
        total_invested: sip.total_invested,
        current_value: sip.current_value,
        is_active: sip.is_active,
        sip_date_of_month: sip.sip_date_of_month,
        missed_count: sip.missed_count,
        notes: sip.notes || "",
      });
    } else {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      setFormData({
        fund_name: "",
        category: "",
        monthly_amount: 0,
        start_date: today.toISOString().split("T")[0],
        next_sip_date: nextMonth.toISOString().split("T")[0],
        total_invested: 0,
        current_value: 0,
        is_active: true,
        sip_date_of_month: 1,
        missed_count: 0,
        notes: "",
      });
    }
  }, [sip, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      category: formData.category || null,
      notes: formData.notes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sip ? "Edit SIP" : "Add SIP"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fund_name">Fund Name *</Label>
            <Input
              id="fund_name"
              value={formData.fund_name}
              onChange={(e) => setFormData({ ...formData, fund_name: e.target.value })}
              placeholder="e.g., Axis Bluechip Fund"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Large Cap">Large Cap</SelectItem>
                  <SelectItem value="Mid Cap">Mid Cap</SelectItem>
                  <SelectItem value="Small Cap">Small Cap</SelectItem>
                  <SelectItem value="Flexi Cap">Flexi Cap</SelectItem>
                  <SelectItem value="ELSS">ELSS</SelectItem>
                  <SelectItem value="Index Fund">Index Fund</SelectItem>
                  <SelectItem value="Debt">Debt</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="monthly_amount">Monthly Amount (₹) *</Label>
              <Input
                id="monthly_amount"
                type="number"
                value={formData.monthly_amount}
                onChange={(e) => setFormData({ ...formData, monthly_amount: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sip_date_of_month">SIP Date (Day of Month)</Label>
              <Select
                value={String(formData.sip_date_of_month)}
                onValueChange={(value) => setFormData({ ...formData, sip_date_of_month: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_invested">Total Invested (₹)</Label>
              <Input
                id="total_invested"
                type="number"
                value={formData.total_invested}
                onChange={(e) => setFormData({ ...formData, total_invested: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="current_value">Current Value (₹)</Label>
              <Input
                id="current_value"
                type="number"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="next_sip_date">Next SIP Date *</Label>
            <Input
              id="next_sip_date"
              type="date"
              value={formData.next_sip_date}
              onChange={(e) => setFormData({ ...formData, next_sip_date: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active SIP</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {sip ? "Update" : "Add"} SIP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SIPDialog;
