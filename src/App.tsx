// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider, useAuth } from "@/context/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import User from "@/pages/User";
import PostedScripts from "@/pages/PostedScripts";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import Payment from "@/pages/Payment";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scripts"
        element={
          <ProtectedRoute>
            <PostedScripts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
