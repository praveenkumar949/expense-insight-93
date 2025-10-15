import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavings } from "@/hooks/useSavings";
import { useToast } from "@/hooks/use-toast";
import { formatIndianCurrency } from "@/lib/csvExport";

const ExportDataDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { expenses } = useExpenses();
  const { savings } = useSavings();

  const exportAllData = () => {
    try {
      // Prepare expenses data
      const expensesCSV = [
        ["Date", "Category", "Amount"],
        ...expenses.map(exp => [
          new Date(exp.date).toLocaleDateString(),
          exp.category,
          exp.amount
        ])
      ].map(row => row.join(",")).join("\n");

      // Prepare savings data
      const savingsCSV = [
        ["Date", "Amount", "Source", "Description"],
        ...savings.map(sav => [
          new Date(sav.date).toLocaleDateString(),
          sav.amount,
          sav.source,
          sav.description || ""
        ])
      ].map(row => row.join(",")).join("\n");

      // Create combined export
      const combinedData = `EXPENSES DATA\n${expensesCSV}\n\n\nSAVINGS DATA\n${savingsCSV}`;
      
      const blob = new Blob([combinedData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finguide-all-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "All data has been exported",
      });
      setOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export All Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export All Data</DialogTitle>
          <DialogDescription>
            Download all your expenses and savings data in CSV format
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will export:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>All expense records</li>
            <li>All savings records</li>
          </ul>
          <Button onClick={exportAllData} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataDialog;