-- Create investments table for mutual funds, stocks, etc.
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'mutual_fund', 'stock', 'crypto', 'gold', 'etf', 'cash'
  sub_category TEXT, -- Fund category like 'Large Cap', 'Small Cap', etc.
  invested_amount NUMERIC NOT NULL DEFAULT 0,
  current_value NUMERIC NOT NULL DEFAULT 0,
  units NUMERIC, -- For crypto/stocks
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'redeemed', 'partial'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SIP tracker table
CREATE TABLE public.sip_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fund_name TEXT NOT NULL,
  category TEXT, -- 'Large Cap', 'Mid Cap', etc.
  monthly_amount NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  next_sip_date DATE NOT NULL,
  total_invested NUMERIC NOT NULL DEFAULT 0,
  current_value NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sip_date_of_month INTEGER NOT NULL DEFAULT 1, -- 1-28
  missed_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on investments
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investments"
ON public.investments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments"
ON public.investments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments"
ON public.investments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments"
ON public.investments FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on sip_investments
ALTER TABLE public.sip_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SIPs"
ON public.sip_investments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SIPs"
ON public.sip_investments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SIPs"
ON public.sip_investments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SIPs"
ON public.sip_investments FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_investments_updated_at
BEFORE UPDATE ON public.investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sip_investments_updated_at
BEFORE UPDATE ON public.sip_investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();