import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useExpenses } from "@/hooks/useExpenses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SendReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SendReportDialog = ({ open, onOpenChange }: SendReportDialogProps) => {
  const { profile } = useProfile();
  const { expenses, getMonthlyData, availableMonths } = useExpenses();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || "");
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendReport = () => {
    setShowConfirm(true);
  };

  const confirmSendReport = async () => {
    if (!profile || !selectedMonth) return;

    setSending(true);
    try {
      const monthData = getMonthlyData(selectedMonth);
      const monthExpenses = expenses.filter((exp) => {
        const expMonth = format(exp.date, "yyyy-MM");
        return expMonth === selectedMonth;
      });

      const [year, month] = selectedMonth.split("-");
      const monthName = format(new Date(parseInt(year), parseInt(month) - 1), "MMMM");

      const { error } = await supabase.functions.invoke("send-expense-report", {
        body: {
          month: monthName,
          year: year,
          email: profile.email,
          expenses: monthExpenses.map((exp) => ({
            date: exp.date,
            category: exp.category,
            subCategory: exp.subCategory,
            merchant: exp.merchant,
            amount: exp.amount,
          })),
          summary: {
            totalSpending: monthData.totalSpending,
            categoryTotals: monthData.categoryTotals,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Report Sent Successfully",
        description: `Expense report for ${monthName} ${year} has been sent to ${profile.email}`,
      });
      setShowConfirm(false);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send report",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Expense Report</DialogTitle>
            <DialogDescription>
              Select a month to generate and send a detailed expense report to your email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-month">Select Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="report-month">
                  <SelectValue placeholder="Choose a month" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => {
                    const [year, monthNum] = month.split("-");
                    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                    return (
                      <SelectItem key={month} value={month}>
                        {format(date, "MMMM yyyy")}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted p-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>Report will be sent to: {profile?.email}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                The report includes a summary and CSV file with all expenses
              </p>
            </div>

            <Button onClick={handleSendReport} disabled={!selectedMonth || sending} className="w-full">
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send Report</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMonth && (
                <>
                  Do you want to send the expense summary for{" "}
                  <strong>
                    {format(
                      new Date(
                        parseInt(selectedMonth.split("-")[0]),
                        parseInt(selectedMonth.split("-")[1]) - 1
                      ),
                      "MMMM yyyy"
                    )}
                  </strong>{" "}
                  to <strong>{profile?.email}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendReport} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm & Send
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SendReportDialog;
