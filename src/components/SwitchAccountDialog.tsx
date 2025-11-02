import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

interface SwitchAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SwitchAccountDialog = ({ open, onOpenChange }: SwitchAccountDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Sign out current user
      await supabase.auth.signOut();

      // Sign in with new account
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Account Switched",
        description: "Successfully switched to the new account",
      });
      onOpenChange(false);
      setEmail("");
      setPassword("");
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Switch Failed",
        description: error.message || "Failed to switch account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch Account</DialogTitle>
          <DialogDescription>
            Sign in with a different account. Your current session will be ended.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSwitch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="switch-email">Email</Label>
            <Input
              id="switch-email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="switch-password">Password</Label>
            <Input
              id="switch-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Switch Account
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchAccountDialog;
