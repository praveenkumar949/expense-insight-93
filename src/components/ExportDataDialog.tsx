import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSavings } from "@/hooks/useSavings";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToDOCX } from "@/lib/exportUtils";

const ExportDataDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"csv" | "pdf" | "docx">("csv");
  const { expenses } = useExpenses();
  const { savings } = useSavings();

  const exportAllData = () => {
    try {
      const allData = [
        ...expenses.map(exp => ({
          date: exp.date,
          category: exp.category,
          subCategory: exp.subCategory,
          merchant: exp.merchant,
          amount: exp.amount,
          source: "Expense"
        })),
        ...savings.map(sav => ({
          date: sav.date,
          category: "Savings",
          subCategory: sav.source,
          merchant: "",
          amount: sav.amount,
          description: sav.description || "",
          source: "Savings"
        }))
      ];

      const timestamp = new Date().toISOString().split("T")[0];

      if (format === "csv") {
        const csvHeader = ["Date", "Category", "Sub Category", "Merchant", "Amount", "Source"];
        const csvRows = allData.map(item => [
          new Date(item.date).toLocaleDateString(),
          item.category,
          item.subCategory,
          item.merchant,
          item.amount,
          item.source
        ]);
        const csvContent = [csvHeader, ...csvRows].map(row => row.join(",")).join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `finguide-all-data-${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        exportToPDF(allData, `finguide-all-data-${timestamp}.pdf`, "FinGuide - All Data Export");
      } else if (format === "docx") {
        exportToDOCX(allData, `finguide-all-data-${timestamp}.doc`, "FinGuide - All Data Export");
      }

      toast({
        title: "Export Successful",
        description: `All data has been exported as ${format.toUpperCase()}`,
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
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            This will export:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>All expense records</li>
            <li>All savings records</li>
          </ul>
          <Button onClick={exportAllData} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download {format.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataDialog;