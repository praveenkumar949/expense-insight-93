import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Settings, Download, LogOut, Mail, Bug, Lock, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileEditDialog from "./ProfileEditDialog";
import ReportSettingsDialog from "./ReportSettingsDialog";
import BugReportDialog from "./BugReportDialog";
import PasswordUpdateDialog from "./PasswordUpdateDialog";
import ExportDataDialog from "./ExportDataDialog";
import CreatorInfoDialog from "./CreatorInfoDialog";

const ProfileSheet = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
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
            <div className="text-sm text-muted-foreground">
              Configure automatic report delivery from the Analysis page
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
            </div>
          </div>

          <Separator />

          {/* Creator Info */}
          <div className="space-y-2">
            <CreatorInfoDialog />
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
  );
};

export default ProfileSheet;