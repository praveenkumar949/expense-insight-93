-- Create reminders table for FinRemind feature
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('bill', 'emi', 'sip', 'insurance', 'subscription', 'auto_debit', 'investment', 'custom')),
  amount NUMERIC,
  due_date DATE NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'once' CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  reminder_days INTEGER[] DEFAULT ARRAY[1, 3, 7],
  is_active BOOLEAN DEFAULT true,
  is_paid BOOLEAN DEFAULT false,
  is_auto_debit BOOLEAN DEFAULT false,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own reminders"
  ON public.reminders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
  ON public.reminders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.reminders
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.reminders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create policies table for insurance/policy tracking
CREATE TABLE public.policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_name TEXT NOT NULL,
  policy_number TEXT,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('health', 'term', 'vehicle', 'life', 'home', 'travel', 'other')),
  premium_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  renewal_frequency TEXT NOT NULL DEFAULT 'yearly' CHECK (renewal_frequency IN ('monthly', 'quarterly', 'half_yearly', 'yearly')),
  expiry_date DATE,
  provider TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own policies"
  ON public.policies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own policies"
  ON public.policies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own policies"
  ON public.policies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own policies"
  ON public.policies
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ott', 'utility', 'gym', 'internet', 'mobile', 'cloud', 'software', 'other')),
  amount NUMERIC NOT NULL,
  billing_date DATE NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  is_auto_debit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  provider TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);