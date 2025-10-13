import { Link, useLocation } from "react-router-dom";
import { BarChart3, PlusCircle, TrendingUp, Wallet, Calculator, PiggyBank, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "See you again soon!",
    });
  };

  const navItems = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/input", icon: PlusCircle, label: "Input" },
    { path: "/analysis", icon: TrendingUp, label: "Analysis" },
    { path: "/calculators", icon: Calculator, label: "Calculators" },
    { path: "/savings", icon: PiggyBank, label: "Savings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold sm:text-xl">FinGuide</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
