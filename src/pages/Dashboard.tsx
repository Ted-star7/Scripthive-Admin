import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardCharts } from "@/components/DashboardCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Use localStorage
    const name = localStorage.getItem("fullName");

    if (!token) {
      navigate("/login");
    } else {
      setFullName(name || "Admin");
    }

    setIsAuthChecked(true);
  }, [navigate]);

  if (!isAuthChecked) {
    return null; // Prevents flash while checking auth
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
                Welcome, {fullName}
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
