// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import User from "@/pages/User";
import PostedScripts from "@/pages/PostedScripts";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import Payment from "@/pages/Payment"; // ✅ Correct relative import with alias

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!isAuthenticated ? (
              <Route
                path="/*"
                element={<Login onLogin={() => setIsAuthenticated(true)} />}
              />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scripts" element={<PostedScripts />} />
                <Route path="/users" element={<User />} />
                <Route path="/payments" element={<Payment />} /> {/* ✅ Shows Payment page */}
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
