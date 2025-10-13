import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Input from "./pages/Input";
import Analysis from "./pages/Analysis";
import Calculators from "./pages/Calculators";
import Savings from "./pages/Savings";
import Auth from "./pages/Auth";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/input" element={<ProtectedRoute><Input /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
