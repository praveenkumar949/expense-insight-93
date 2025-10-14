-- Add report preference columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS report_frequency text DEFAULT 'monthly' CHECK (report_frequency IN ('monthly', 'quarterly', 'semi-annual', 'yearly')),
ADD COLUMN IF NOT EXISTS last_report_sent_at timestamp with time zone;