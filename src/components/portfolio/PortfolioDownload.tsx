import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Investment, SIPInvestment, PortfolioSummary } from "@/hooks/usePortfolio";
import { formatIndianCurrency } from "@/lib/csvExport";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface PortfolioDownloadProps {
  investments: Investment[];
  sipInvestments: SIPInvestment[];
  summary: PortfolioSummary;
}

const categoryLabels: Record<string, string> = {
  mutual_fund: "Mutual Funds",
  stock: "Stocks",
  crypto: "Crypto",
  gold: "Gold",
  etf: "ETFs",
  cash: "Cash",
};

const PortfolioDownload = ({ investments, sipInvestments, summary }: PortfolioDownloadProps) => {
  const [open, setOpen] = useState(false);
  const [format_, setFormat] = useState<"pdf" | "csv">("pdf");
  const [sections, setSections] = useState({
    overview: true,
    allocation: true,
    mutualFunds: true,
    crypto: true,
    sips: true,
    all: true,
  });

  const handleSectionChange = (key: keyof typeof sections) => {
    if (key === "all") {
      const newVal = !sections.all;
      setSections({
        overview: newVal,
        allocation: newVal,
        mutualFunds: newVal,
        crypto: newVal,
        sips: newVal,
        all: newVal,
      });
    } else {
      setSections(prev => ({ ...prev, [key]: !prev[key], all: false }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Portfolio Report", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${format(new Date(), "dd MMM yyyy, HH:mm")}`, pageWidth / 2, y, { align: "center" });
    y += 15;

    // Overview Section
    if (sections.overview) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Portfolio Overview", 14, y);
      y += 8;

      const isProfit = summary.overallGainLoss >= 0;
      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Total Invested", formatIndianCurrency(summary.totalInvested)],
          ["Current Value", formatIndianCurrency(summary.currentValue)],
          ["Overall Returns", `${isProfit ? "+" : ""}${formatIndianCurrency(summary.overallGainLoss)} (${isProfit ? "+" : ""}${summary.overallGainLossPercent.toFixed(2)}%)`],
        ],
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    }

    // Allocation Section
    if (sections.allocation && summary.allocation.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Asset Allocation", 14, y);
      y += 8;

      autoTable(doc, {
        startY: y,
        head: [["Asset Class", "Value", "Allocation %"]],
        body: summary.allocation.map(a => [
          categoryLabels[a.category] || a.category,
          formatIndianCurrency(a.value),
          `${a.percentage.toFixed(1)}%`,
        ]),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    }

    // Mutual Funds Section
    if (sections.mutualFunds) {
      const mfs = investments.filter(i => i.category === "mutual_fund");
      if (mfs.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Mutual Fund Holdings", 14, y);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [["Fund Name", "Category", "Invested", "Current", "Returns"]],
          body: mfs.map(mf => {
            const returns = mf.current_value - mf.invested_amount;
            const pct = mf.invested_amount > 0 ? (returns / mf.invested_amount) * 100 : 0;
            return [
              mf.name,
              mf.sub_category || "-",
              formatIndianCurrency(mf.invested_amount),
              formatIndianCurrency(mf.current_value),
              `${returns >= 0 ? "+" : ""}${formatIndianCurrency(returns)} (${pct.toFixed(1)}%)`,
            ];
          }),
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });
        y = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // Crypto Section
    if (sections.crypto) {
      const cryptos = investments.filter(i => i.category === "crypto");
      if (cryptos.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Crypto Holdings", 14, y);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [["Coin", "Quantity", "Invested", "Current", "Returns"]],
          body: cryptos.map(c => {
            const returns = c.current_value - c.invested_amount;
            const pct = c.invested_amount > 0 ? (returns / c.invested_amount) * 100 : 0;
            return [
              c.name,
              c.units?.toString() || "-",
              formatIndianCurrency(c.invested_amount),
              formatIndianCurrency(c.current_value),
              `${returns >= 0 ? "+" : ""}${formatIndianCurrency(returns)} (${pct.toFixed(1)}%)`,
            ];
          }),
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });
        y = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // SIPs Section
    if (sections.sips && sipInvestments.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SIP Investments", 14, y);
      y += 8;

      autoTable(doc, {
        startY: y,
        head: [["Fund Name", "Monthly", "Total Invested", "Current", "Status"]],
        body: sipInvestments.map(s => [
          s.fund_name,
          formatIndianCurrency(s.monthly_amount),
          formatIndianCurrency(s.total_invested),
          formatIndianCurrency(s.current_value),
          s.is_active ? "Active" : "Paused",
        ]),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    doc.save(`portfolio-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast.success("Portfolio report downloaded!");
    setOpen(false);
  };

  const generateCSV = () => {
    const rows: string[][] = [];

    // Overview
    if (sections.overview) {
      rows.push(["PORTFOLIO OVERVIEW"]);
      rows.push(["Metric", "Value"]);
      rows.push(["Total Invested", summary.totalInvested.toString()]);
      rows.push(["Current Value", summary.currentValue.toString()]);
      rows.push(["Overall Returns", summary.overallGainLoss.toString()]);
      rows.push(["Returns %", summary.overallGainLossPercent.toFixed(2)]);
      rows.push([]);
    }

    // Allocation
    if (sections.allocation && summary.allocation.length > 0) {
      rows.push(["ASSET ALLOCATION"]);
      rows.push(["Category", "Value", "Percentage"]);
      summary.allocation.forEach(a => {
        rows.push([categoryLabels[a.category] || a.category, a.value.toString(), a.percentage.toFixed(2)]);
      });
      rows.push([]);
    }

    // Investments
    const exportInvestments = (cats: string[], title: string) => {
      const filtered = investments.filter(i => cats.includes(i.category));
      if (filtered.length > 0) {
        rows.push([title]);
        rows.push(["Name", "Category", "Sub-Category", "Invested", "Current", "Returns", "Returns %", "Status", "Purchase Date"]);
        filtered.forEach(inv => {
          const returns = inv.current_value - inv.invested_amount;
          const pct = inv.invested_amount > 0 ? (returns / inv.invested_amount) * 100 : 0;
          rows.push([
            inv.name,
            inv.category,
            inv.sub_category || "",
            inv.invested_amount.toString(),
            inv.current_value.toString(),
            returns.toString(),
            pct.toFixed(2),
            inv.status,
            inv.purchase_date,
          ]);
        });
        rows.push([]);
      }
    };

    if (sections.mutualFunds) exportInvestments(["mutual_fund"], "MUTUAL FUNDS");
    if (sections.crypto) exportInvestments(["crypto"], "CRYPTO HOLDINGS");

    // SIPs
    if (sections.sips && sipInvestments.length > 0) {
      rows.push(["SIP INVESTMENTS"]);
      rows.push(["Fund Name", "Category", "Monthly Amount", "Total Invested", "Current Value", "Status", "Next SIP Date"]);
      sipInvestments.forEach(s => {
        rows.push([
          s.fund_name,
          s.category || "",
          s.monthly_amount.toString(),
          s.total_invested.toString(),
          s.current_value.toString(),
          s.is_active ? "Active" : "Paused",
          s.next_sip_date,
        ]);
      });
    }

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Portfolio CSV downloaded!");
    setOpen(false);
  };

  const handleDownload = () => {
    if (format_ === "pdf") {
      generatePDF();
    } else {
      generateCSV();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Download Portfolio Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="text-base">Format</Label>
            <RadioGroup value={format_} onValueChange={(v) => setFormat(v as "pdf" | "csv")} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  PDF (Recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV (Spreadsheet)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base">Include Sections</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="all" checked={sections.all} onCheckedChange={() => handleSectionChange("all")} />
                <Label htmlFor="all" className="cursor-pointer font-medium">Select All</Label>
              </div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="overview" checked={sections.overview} onCheckedChange={() => handleSectionChange("overview")} />
                  <Label htmlFor="overview" className="cursor-pointer">Portfolio Overview</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allocation" checked={sections.allocation} onCheckedChange={() => handleSectionChange("allocation")} />
                  <Label htmlFor="allocation" className="cursor-pointer">Asset Allocation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mutualFunds" checked={sections.mutualFunds} onCheckedChange={() => handleSectionChange("mutualFunds")} />
                  <Label htmlFor="mutualFunds" className="cursor-pointer">Mutual Funds</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="crypto" checked={sections.crypto} onCheckedChange={() => handleSectionChange("crypto")} />
                  <Label htmlFor="crypto" className="cursor-pointer">Crypto Holdings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sips" checked={sections.sips} onCheckedChange={() => handleSectionChange("sips")} />
                  <Label htmlFor="sips" className="cursor-pointer">SIP Investments</Label>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDownload;
