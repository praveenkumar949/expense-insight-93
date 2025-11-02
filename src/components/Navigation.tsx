import { Link, useLocation } from "react-router-dom";
import { BarChart3, PlusCircle, TrendingUp, Wallet, Calculator, PiggyBank, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import ProfileSheet from "./ProfileSheet";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/input", icon: PlusCircle, label: "Input" },
    { path: "/analysis", icon: TrendingUp, label: "Analysis" },
    { path: "/savings", icon: PiggyBank, label: "Savings" },
    { path: "/finnote", icon: FileText, label: "FinNote" },
    { path: "/calculators", icon: Calculator, label: "Calculators" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="FinGuide Logo" className="h-10 w-10 rounded-lg object-cover" />
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
          <ProfileSheet />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
