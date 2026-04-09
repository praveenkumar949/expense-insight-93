import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Investment } from "@/hooks/usePortfolio";

interface InvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (investment: Omit<Investment, "id" | "user_id" | "created_at" | "updated_at">) => void;
  investment?: Investment | null;
}

const categoryLabels: Record<string, string> = {
  mutual_fund: "Mutual Fund",
  stock: "Stock",
  crypto: "Crypto",
  gold: "Gold",
  etf: "ETF",
  cash: "Cash",
};

const InvestmentDialog = ({ open, onOpenChange, onSave, investment }: InvestmentDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "mutual_fund" as Investment["category"],
    sub_category: "",
    invested_amount: 0,
    current_value: 0,
    units: null as number | null,
    purchase_date: new Date().toISOString().split("T")[0],
    status: "active" as Investment["status"],
    notes: "",
  });

  useEffect(() => {
    if (investment) {
      setFormData({
        name: investment.name,
        category: investment.category,
        sub_category: investment.sub_category || "",
        invested_amount: investment.invested_amount,
        current_value: investment.current_value,
        units: investment.units,
        purchase_date: investment.purchase_date,
        status: investment.status,
        notes: investment.notes || "",
      });
    } else {
      setFormData({
        name: "",
        category: "mutual_fund",
        sub_category: "",
        invested_amount: 0,
        current_value: 0,
        units: null,
        purchase_date: new Date().toISOString().split("T")[0],
        status: "active",
        notes: "",
      });
    }
  }, [investment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      sub_category: formData.sub_category || null,
      notes: formData.notes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{investment ? "Edit Investment" : "Add Investment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., HDFC Flexi Cap Fund"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Investment["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sub_category">Sub-Category</Label>
              <Input
                id="sub_category"
                value={formData.sub_category}
                onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                placeholder="e.g., Large Cap"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invested_amount">Invested Amount (₹) *</Label>
              <Input
                id="invested_amount"
                type="number"
                value={formData.invested_amount}
                onChange={(e) => setFormData({ ...formData, invested_amount: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="current_value">Current Value (₹) *</Label>
              <Input
                id="current_value"
                type="number"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {(formData.category === "crypto" || formData.category === "stock" || formData.category === "gold") && (
            <div>
              <Label htmlFor="units">Units/Quantity</Label>
              <Input
                id="units"
                type="number"
                step="0.0001"
                value={formData.units || ""}
                onChange={(e) => setFormData({ ...formData, units: e.target.value ? Number(e.target.value) : null })}
                placeholder="e.g., 0.5 BTC"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_date">Purchase Date *</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Investment["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="redeemed">Redeemed</SelectItem>
                  <SelectItem value="partial">Partially Redeemed</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {investment ? "Update" : "Add"} Investment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDialog;
