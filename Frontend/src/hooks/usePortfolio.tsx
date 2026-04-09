import { useState, useEffect } from "react";
import { api } from "@/integrations/api/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  category: 'mutual_fund' | 'stock' | 'crypto' | 'gold' | 'etf' | 'cash';
  sub_category: string | null;
  invested_amount: number;
  current_value: number;
  units: number | null;
  purchase_date: string;
  status: 'active' | 'redeemed' | 'partial';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SIPInvestment {
  id: string;
  user_id: string;
  fund_name: string;
  category: string | null;
  monthly_amount: number;
  start_date: string;
  next_sip_date: string;
  total_invested: number;
  current_value: number;
  is_active: boolean;
  sip_date_of_month: number;
  missed_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  overallGainLoss: number;
  overallGainLossPercent: number;
  allocation: { category: string; value: number; percentage: number }[];
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [sipInvestments, setSipInvestments] = useState<SIPInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!user) return;
    try {
      const data = await api.table.list("investments");
      setInvestments(data as Investment[]);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const fetchSIPInvestments = async () => {
    if (!user) return;
    try {
      const data = await api.table.list("sip_investments");
      setSipInvestments(data as SIPInvestment[]);
    } catch (error) {
      console.error("Error fetching SIP investments:", error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchInvestments(), fetchSIPInvestments()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAll();
    } else {
      setInvestments([]);
      setSipInvestments([]);
      setLoading(false);
    }
  }, [user]);

  // Investment CRUD
  const addInvestment = async (investment: Omit<Investment, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      await api.table.insert("investments", investment);
    } catch (error) {
      toast.error("Failed to add investment");
      console.error(error);
      return;
    }
    toast.success("Investment added");
    fetchInvestments();
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    try {
      await api.table.update("investments", id, updates);
    } catch {
      toast.error("Failed to update investment");
      return;
    }
    toast.success("Investment updated");
    fetchInvestments();
  };

  const deleteInvestment = async (id: string) => {
    try {
      await api.table.remove("investments", id);
    } catch {
      toast.error("Failed to delete investment");
      return;
    }
    toast.success("Investment deleted");
    fetchInvestments();
  };

  // SIP CRUD
  const addSIP = async (sip: Omit<SIPInvestment, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      await api.table.insert("sip_investments", sip);
    } catch (error) {
      toast.error("Failed to add SIP");
      console.error(error);
      return;
    }
    toast.success("SIP added");
    fetchSIPInvestments();
  };

  const updateSIP = async (id: string, updates: Partial<SIPInvestment>) => {
    try {
      await api.table.update("sip_investments", id, updates);
    } catch {
      toast.error("Failed to update SIP");
      return;
    }
    toast.success("SIP updated");
    fetchSIPInvestments();
  };

  const deleteSIP = async (id: string) => {
    try {
      await api.table.remove("sip_investments", id);
    } catch {
      toast.error("Failed to delete SIP");
      return;
    }
    toast.success("SIP deleted");
    fetchSIPInvestments();
  };

  // Portfolio Summary
  const getPortfolioSummary = (): PortfolioSummary => {
    const activeInvestments = investments.filter(i => i.status === 'active');
    
    const totalInvested = activeInvestments.reduce((sum, i) => sum + Number(i.invested_amount), 0) +
      sipInvestments.filter(s => s.is_active).reduce((sum, s) => sum + Number(s.total_invested), 0);
    
    const currentValue = activeInvestments.reduce((sum, i) => sum + Number(i.current_value), 0) +
      sipInvestments.filter(s => s.is_active).reduce((sum, s) => sum + Number(s.current_value), 0);
    
    const overallGainLoss = currentValue - totalInvested;
    const overallGainLossPercent = totalInvested > 0 ? (overallGainLoss / totalInvested) * 100 : 0;

    // Calculate allocation by category
    const allocationMap = new Map<string, number>();
    activeInvestments.forEach(i => {
      const current = allocationMap.get(i.category) || 0;
      allocationMap.set(i.category, current + Number(i.current_value));
    });
    sipInvestments.filter(s => s.is_active).forEach(s => {
      const current = allocationMap.get('mutual_fund') || 0;
      allocationMap.set('mutual_fund', current + Number(s.current_value));
    });

    const allocation = Array.from(allocationMap.entries()).map(([category, value]) => ({
      category,
      value,
      percentage: currentValue > 0 ? (value / currentValue) * 100 : 0,
    }));

    return { totalInvested, currentValue, overallGainLoss, overallGainLossPercent, allocation };
  };

  // Get investments by category
  const getMutualFunds = () => investments.filter(i => i.category === 'mutual_fund');
  const getCrypto = () => investments.filter(i => i.category === 'crypto');
  const getStocks = () => investments.filter(i => i.category === 'stock');
  const getActiveSIPs = () => sipInvestments.filter(s => s.is_active);
  
  const getTotalMonthlySIP = () => 
    sipInvestments.filter(s => s.is_active).reduce((sum, s) => sum + Number(s.monthly_amount), 0);

  return {
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
    getStocks,
    getActiveSIPs,
    getTotalMonthlySIP,
    refetch: fetchAll,
  };
};
