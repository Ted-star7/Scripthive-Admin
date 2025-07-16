import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [user, loading, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/scripts" element={<PostedScripts />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/registration-limits" element={<RegistrationLimits />} />
        </>
      ) : null}
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;