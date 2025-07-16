import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import User from "@/pages/User";
import PostedScripts from "@/pages/PostedScripts";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import Payment from "@/pages/Payment";
import RegistrationLimits from "@/pages/RegistrationLimits";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthProvider";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Authenticated routes wrapped in SidebarProvider
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<User />} />
        <Route path="/scripts" element={<PostedScripts />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/registration-limits" element={<RegistrationLimits />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
