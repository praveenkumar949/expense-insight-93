import { useState, useEffect } from "react";
import { api } from "@/integrations/api/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'bill' | 'emi' | 'sip' | 'insurance' | 'subscription' | 'auto_debit' | 'investment' | 'custom';
  amount: number | null;
  due_date: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  reminder_days: number[];
  is_active: boolean;
  is_paid: boolean;
  is_auto_debit: boolean;
  last_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  user_id: string;
  policy_name: string;
  policy_number: string | null;
  policy_type: 'health' | 'term' | 'vehicle' | 'life' | 'home' | 'travel' | 'other';
  premium_amount: number;
  due_date: string;
  renewal_frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
  expiry_date: string | null;
  provider: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  category: 'ott' | 'utility' | 'gym' | 'internet' | 'mobile' | 'cloud' | 'software' | 'other';
  amount: number;
  billing_date: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  is_auto_debit: boolean;
  is_active: boolean;
  provider: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    if (!user) return;
    try {
      const data = await api.table.list("reminders");
      setReminders(data as Reminder[]);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast({ title: "Error", description: "Failed to fetch reminders", variant: "destructive" });
    }
  };

  const fetchPolicies = async () => {
    if (!user) return;
    try {
      const data = await api.table.list("policies");
      setPolicies(data as Policy[]);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast({ title: "Error", description: "Failed to fetch policies", variant: "destructive" });
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    try {
      const data = await api.table.list("subscriptions");
      setSubscriptions(data as Subscription[]);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({ title: "Error", description: "Failed to fetch subscriptions", variant: "destructive" });
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchReminders(), fetchPolicies(), fetchSubscriptions()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  // Reminder CRUD
  const addReminder = async (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_notified_at'>) => {
    if (!user) return null;
    try {
      const data = await api.table.insert("reminders", reminder);
      toast({ title: "Success", description: "Reminder added successfully" });
      await fetchReminders();
      return data as Reminder;
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast({ title: "Error", description: "Failed to add reminder", variant: "destructive" });
      return null;
    }
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      await api.table.update("reminders", id, updates);
      toast({ title: "Success", description: "Reminder updated" });
      await fetchReminders();
      return true;
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast({ title: "Error", description: "Failed to update reminder", variant: "destructive" });
      return false;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await api.table.remove("reminders", id);
      toast({ title: "Success", description: "Reminder deleted" });
      await fetchReminders();
      return true;
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({ title: "Error", description: "Failed to delete reminder", variant: "destructive" });
      return false;
    }
  };

  const markAsPaid = async (id: string) => {
    return updateReminder(id, { is_paid: true });
  };

  // Policy CRUD
  const addPolicy = async (policy: Omit<Policy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    try {
      const data = await api.table.insert("policies", policy);
      toast({ title: "Success", description: "Policy added successfully" });
      await fetchPolicies();
      return data as Policy;
    } catch (error) {
      console.error("Error adding policy:", error);
      toast({ title: "Error", description: "Failed to add policy", variant: "destructive" });
      return null;
    }
  };

  const updatePolicy = async (id: string, updates: Partial<Policy>) => {
    try {
      await api.table.update("policies", id, updates);
      toast({ title: "Success", description: "Policy updated" });
      await fetchPolicies();
      return true;
    } catch (error) {
      console.error("Error updating policy:", error);
      toast({ title: "Error", description: "Failed to update policy", variant: "destructive" });
      return false;
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      await api.table.remove("policies", id);
      toast({ title: "Success", description: "Policy deleted" });
      await fetchPolicies();
      return true;
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast({ title: "Error", description: "Failed to delete policy", variant: "destructive" });
      return false;
    }
  };

  // Subscription CRUD
  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    try {
      const data = await api.table.insert("subscriptions", subscription);
      toast({ title: "Success", description: "Subscription added successfully" });
      await fetchSubscriptions();
      return data as Subscription;
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast({ title: "Error", description: "Failed to add subscription", variant: "destructive" });
      return null;
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      await api.table.update("subscriptions", id, updates);
      toast({ title: "Success", description: "Subscription updated" });
      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({ title: "Error", description: "Failed to update subscription", variant: "destructive" });
      return false;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      await api.table.remove("subscriptions", id);
      toast({ title: "Success", description: "Subscription deleted" });
      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast({ title: "Error", description: "Failed to delete subscription", variant: "destructive" });
      return false;
    }
  };

  // Helper functions
  const getUpcomingReminders = (days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return reminders.filter(r => {
      const dueDate = new Date(r.due_date);
      return dueDate >= today && dueDate <= futureDate && r.is_active && !r.is_paid;
    });
  };

  const getAutoDebits = () => {
    return [
      ...reminders.filter(r => r.is_auto_debit && r.is_active),
      ...subscriptions.filter(s => s.is_auto_debit && s.is_active)
    ];
  };

  const getMonthlyCommitments = () => {
    const totalReminders = reminders
      .filter(r => r.is_active && r.frequency === 'monthly')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalPolicies = policies
      .filter(p => p.is_active && p.renewal_frequency === 'monthly')
      .reduce((sum, p) => sum + p.premium_amount, 0);

    const totalSubscriptions = subscriptions
      .filter(s => s.is_active && s.frequency === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0);

    return totalReminders + totalPolicies + totalSubscriptions;
  };

  return {
    reminders,
    policies,
    subscriptions,
    loading,
    fetchAll,
    // Reminder functions
    addReminder,
    updateReminder,
    deleteReminder,
    markAsPaid,
    // Policy functions
    addPolicy,
    updatePolicy,
    deletePolicy,
    // Subscription functions
    addSubscription,
    updateSubscription,
    deleteSubscription,
    // Helper functions
    getUpcomingReminders,
    getAutoDebits,
    getMonthlyCommitments
  };
};
