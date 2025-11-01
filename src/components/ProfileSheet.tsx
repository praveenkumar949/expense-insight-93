import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Settings, Download, LogOut, Mail, Bug, Lock, Moon, Sun, FileText, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditDialog from "./ProfileEditDialog";
import ReportSettingsDialog from "./ReportSettingsDialog";
import BugReportDialog from "./BugReportDialog";
import PasswordUpdateDialog from "./PasswordUpdateDialog";
import ExportDataDialog from "./ExportDataDialog";
import CreatorInfoDialog from "./CreatorInfoDialog";
import TermsDialog from "./TermsDialog";
import SendReportDialog from "./SendReportDialog";

const ProfileSheet = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSendReport, setShowSendReport] = useState(false);
  const [showReportSettings, setShowReportSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  const handleDeleteAccount = async () => {
    try {
      // Delete user data from all tables
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Sign out and let auth triggers handle the rest
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Profile & Settings</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{profile?.full_name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  {profile?.phone_number && (
                    <p className="text-sm text-muted-foreground">{profile.phone_number}</p>
                  )}
                </div>
              </div>
              <ProfileEditDialog />
            </div>

            <Separator />

            {/* Reports Management */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Reports Management
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowSendReport(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowReportSettings(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Auto Reports
                </Button>
              </div>
            </div>

            <Separator />

            {/* Export Data */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </h4>
              <ExportDataDialog />
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </h4>
              <div className="space-y-2">
                <PasswordUpdateDialog />
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>

                <BugReportDialog />
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowTerms(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Terms & Conditions
                </Button>
              </div>
            </div>

            <Separator />

            {/* Creator Info */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowCreatorInfo(true)}
              >
                <User className="mr-2 h-4 w-4" />
                Connect with Creator
              </Button>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive">Danger Zone</h4>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>

            <Separator />

            {/* Sign Out */}
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <CreatorInfoDialog open={showCreatorInfo} onOpenChange={setShowCreatorInfo} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <SendReportDialog open={showSendReport} onOpenChange={setShowSendReport} />
      <ReportSettingsDialog open={showReportSettings} onOpenChange={setShowReportSettings} />
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data including expenses, savings, notes, and goals from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileSheet;
