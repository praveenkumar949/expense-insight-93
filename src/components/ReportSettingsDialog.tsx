import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

interface ReportSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportSettingsDialog = ({ open, onOpenChange }: ReportSettingsDialogProps) => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(profile?.monthly_report_enabled ?? false);
  const [frequency, setFrequency] = useState(profile?.report_frequency ?? "monthly");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "docx">("csv");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          monthly_report_enabled: isEnabled,
          report_frequency: frequency,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: `Automatic reports ${isEnabled ? "enabled" : "disabled"}. Reports will be sent ${frequency}.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Automatic Report Settings</DialogTitle>
          <DialogDescription>
            Configure automatic expense report delivery to your email
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-reports">Enable Automatic Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive expense summaries automatically
              </p>
            </div>
            <Switch
              id="enable-reports"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          {isEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="frequency">Report Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                    <SelectItem value="semi-annual">Semi-Annual (6 months)</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-format">Report Format</Label>
                <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <SelectTrigger id="report-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                {exportFormat.toUpperCase()} reports will be sent to: {profile?.email}
              </p>
            </>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportSettingsDialog;
