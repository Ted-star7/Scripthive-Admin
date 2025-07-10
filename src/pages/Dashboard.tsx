// src/pages/Dashboard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardCharts } from "@/components/DashboardCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="p-6">Loading...</div>; // Optional: spinner here
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-scripthive-gray-light">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-scripthive-black mb-2">
                Welcome, {user.fullName || "Admin"}
              </h1>
              <p className="text-scripthive-gray-dark">
                Here's what's happening with ScriptHive today.
              </p>
            </div>
            <DashboardStats />
            <DashboardCharts />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
