import { Link, useLocation } from "react-router-dom";
import { BarChart3, PlusCircle, TrendingUp, Calculator, PiggyBank, FileText, Menu, X, GraduationCap, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileSheet from "./ProfileSheet";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navigation on landing page or auth page
  if (location.pathname === "/" || location.pathname === "/auth") {
    return null;
  }

  const navItems = [
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/input", icon: PlusCircle, label: "Input" },
    { path: "/analysis", icon: TrendingUp, label: "Analysis" },
    { path: "/savings", icon: PiggyBank, label: "Savings" },
    { path: "/finremind", icon: Bell, label: "FinRemind" },
    { path: "/finnote", icon: FileText, label: "FinNote" },
    { path: "/finedu", icon: GraduationCap, label: "FinEdu" },
    { path: "/calculators", icon: Calculator, label: "Calculators" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="FinGuide Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-base font-bold sm:text-xl">FinGuide</span>
            <span className="text-xs text-muted-foreground hidden lg:block">Your Path to Financial Flourish</span>
          </div>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:px-4",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side - Profile and Mobile Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ProfileSheet />
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t">
                <ProfileSheet />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
