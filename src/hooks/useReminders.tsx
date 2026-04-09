import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
      toast({ title: "Error", description: "Failed to fetch reminders", variant: "destructive" });
    } else {
      setReminders(data as Reminder[]);
    }
  };

  const fetchPolicies = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching policies:', error);
      toast({ title: "Error", description: "Failed to fetch policies", variant: "destructive" });
    } else {
      setPolicies(data as Policy[]);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('billing_date', { ascending: true });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      toast({ title: "Error", description: "Failed to fetch subscriptions", variant: "destructive" });
    } else {
      setSubscriptions(data as Subscription[]);
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

    const { data, error } = await supabase
      .from('reminders')
      .insert({ ...reminder, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding reminder:', error);
      toast({ title: "Error", description: "Failed to add reminder", variant: "destructive" });
      return null;
    }

    toast({ title: "Success", description: "Reminder added successfully" });
    await fetchReminders();
    return data as Reminder;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const { error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating reminder:', error);
      toast({ title: "Error", description: "Failed to update reminder", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Reminder updated" });
    await fetchReminders();
    return true;
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reminder:', error);
      toast({ title: "Error", description: "Failed to delete reminder", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Reminder deleted" });
    await fetchReminders();
    return true;
  };

  const markAsPaid = async (id: string) => {
    return updateReminder(id, { is_paid: true });
  };

  // Policy CRUD
  const addPolicy = async (policy: Omit<Policy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('policies')
      .insert({ ...policy, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding policy:', error);
      toast({ title: "Error", description: "Failed to add policy", variant: "destructive" });
      return null;
    }

    toast({ title: "Success", description: "Policy added successfully" });
    await fetchPolicies();
    return data as Policy;
  };

  const updatePolicy = async (id: string, updates: Partial<Policy>) => {
    const { error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating policy:', error);
      toast({ title: "Error", description: "Failed to update policy", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Policy updated" });
    await fetchPolicies();
    return true;
  };

  const deletePolicy = async (id: string) => {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting policy:', error);
      toast({ title: "Error", description: "Failed to delete policy", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Policy deleted" });
    await fetchPolicies();
    return true;
  };

  // Subscription CRUD
  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ ...subscription, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding subscription:', error);
      toast({ title: "Error", description: "Failed to add subscription", variant: "destructive" });
      return null;
    }

    toast({ title: "Success", description: "Subscription added successfully" });
    await fetchSubscriptions();
    return data as Subscription;
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    const { error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating subscription:', error);
      toast({ title: "Error", description: "Failed to update subscription", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Subscription updated" });
    await fetchSubscriptions();
    return true;
  };

  const deleteSubscription = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscription:', error);
      toast({ title: "Error", description: "Failed to delete subscription", variant: "destructive" });
      return false;
    }

    toast({ title: "Success", description: "Subscription deleted" });
    await fetchSubscriptions();
    return true;
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
