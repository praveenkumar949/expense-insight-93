import { Wallet, TrendingUp, DollarSign, PiggyBank } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary animate-gradient bg-[length:200%_200%]">
      <div className="relative">
        {/* Main logo circle with pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-background/20 animate-ping" />
        </div>
        
        {/* Logo container */}
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background shadow-2xl">
          <Wallet className="h-16 w-16 text-primary animate-pulse" />
        </div>

        {/* Orbiting money icons */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <DollarSign className="absolute -top-2 left-1/2 -translate-x-1/2 h-6 w-6 text-success" />
          <TrendingUp className="absolute top-1/2 -right-2 -translate-y-1/2 h-6 w-6 text-chart-wants" />
          <PiggyBank className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 text-chart-emis" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-1/3 text-center">
        <h2 className="text-2xl font-bold text-background animate-pulse">Loading FinGuide</h2>
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-3 w-3 rounded-full bg-background animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 rounded-full bg-background animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 rounded-full bg-background animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
