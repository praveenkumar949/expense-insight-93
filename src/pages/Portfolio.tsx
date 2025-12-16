import { useState } from "react";
import { usePortfolio, Investment, SIPInvestment } from "@/hooks/usePortfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import AllocationChart from "@/components/portfolio/AllocationChart";
import InvestmentList from "@/components/portfolio/InvestmentList";
import SIPList from "@/components/portfolio/SIPList";
import InvestmentDialog from "@/components/portfolio/InvestmentDialog";
import SIPDialog from "@/components/portfolio/SIPDialog";
import PortfolioDownload from "@/components/portfolio/PortfolioDownload";

const Portfolio = () => {
  const {
    investments,
    sipInvestments,
    loading,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addSIP,
    updateSIP,
    deleteSIP,
    getPortfolioSummary,
    getMutualFunds,
    getCrypto,
  } = usePortfolio();

  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [sipDialogOpen, setSipDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [editingSIP, setEditingSIP] = useState<SIPInvestment | null>(null);
  const [addCategory, setAddCategory] = useState<Investment["category"] | null>(null);

  const summary = getPortfolioSummary();

  const handleAddInvestment = (category?: Investment["category"]) => {
    setEditingInvestment(null);
    setAddCategory(category || null);
    setInvestmentDialogOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setAddCategory(null);
    setInvestmentDialogOpen(true);
  };

  const handleSaveInvestment = async (data: Omit<Investment, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (editingInvestment) {
      await updateInvestment(editingInvestment.id, data);
    } else {
      await addInvestment({ ...data, category: addCategory || data.category });
    }
  };

  const handleAddSIP = () => {
    setEditingSIP(null);
    setSipDialogOpen(true);
  };

  const handleEditSIP = (sip: SIPInvestment) => {
    setEditingSIP(sip);
    setSipDialogOpen(true);
  };

  const handleSaveSIP = async (data: Omit<SIPInvestment, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (editingSIP) {
      await updateSIP(editingSIP.id, data);
    } else {
      await addSIP(data);
    }
  };

  if (loading) {
    return (
      <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8 max-w-7xl mx-auto space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">My Portfolio</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track all your investments in one place
          </p>
        </div>
        <div className="flex gap-2">
          <PortfolioDownload 
            investments={investments} 
            sipInvestments={sipInvestments} 
            summary={summary} 
          />
          <Button onClick={() => handleAddInvestment()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <PortfolioOverview summary={summary} />

      {/* Allocation Chart */}
      <AllocationChart allocation={summary.allocation} />

      {/* Tabs for different investment types */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="sips">SIPs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <InvestmentList
            investments={investments.filter(i => i.status === "active")}
            title="All Investments"
            description="All your active investments"
            onEdit={handleEditInvestment}
            onDelete={deleteInvestment}
            onAdd={() => handleAddInvestment()}
          />
          <SIPList
            sips={sipInvestments}
            onEdit={handleEditSIP}
            onDelete={deleteSIP}
            onAdd={handleAddSIP}
          />
        </TabsContent>

        <TabsContent value="mutual-funds">
          <InvestmentList
            investments={getMutualFunds()}
            title="Mutual Fund Holdings"
            description="Your mutual fund investments"
            onEdit={handleEditInvestment}
            onDelete={deleteInvestment}
            onAdd={() => handleAddInvestment("mutual_fund")}
            emptyMessage="No mutual funds yet. Start investing to grow your wealth."
          />
        </TabsContent>

        <TabsContent value="crypto">
          <InvestmentList
            investments={getCrypto()}
            title="Crypto Holdings"
            description="Your cryptocurrency investments"
            onEdit={handleEditInvestment}
            onDelete={deleteInvestment}
            onAdd={() => handleAddInvestment("crypto")}
            emptyMessage="No crypto holdings yet. Add your crypto investments."
          />
        </TabsContent>

        <TabsContent value="sips">
          <SIPList
            sips={sipInvestments}
            onEdit={handleEditSIP}
            onDelete={deleteSIP}
            onAdd={handleAddSIP}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InvestmentDialog
        open={investmentDialogOpen}
        onOpenChange={setInvestmentDialogOpen}
        onSave={handleSaveInvestment}
        investment={editingInvestment}
      />

      <SIPDialog
        open={sipDialogOpen}
        onOpenChange={setSipDialogOpen}
        onSave={handleSaveSIP}
        sip={editingSIP}
      />
    </div>
  );
};

export default Portfolio;
