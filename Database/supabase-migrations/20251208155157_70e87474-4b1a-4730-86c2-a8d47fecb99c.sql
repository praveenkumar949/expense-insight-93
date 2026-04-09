-- Add DELETE policy for appointments table
CREATE POLICY "Users can delete their own appointments"
  ON public.appointments
  FOR DELETE
  USING (auth.uid() = user_id);