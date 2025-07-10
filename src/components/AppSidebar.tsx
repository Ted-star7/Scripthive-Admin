import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  ShieldCheck, // ✅ Added icon for Registration Limit
} from "lucide-react";

// ✅ Updated menuItems array
const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Manage Users", url: "/users", icon: Users },
  { title: "Posted Scripts", url: "/scripts", icon: FileText },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Limit Registrations", url: "/registration-limits", icon: ShieldCheck }, // ✅ New item
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-scripthive-gray-dark/10">
      <SidebarContent className="bg-scripthive-black">
        {/* Logo Section */}
        <div className="p-6 border-b border-scripthive-gray-dark/20">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src="/Logo.png"
                alt="ScriptHive Logo"
                className={`transition-all duration-300 ${
                  isCollapsed ? "w-10 h-10" : "w-12 h-12"
                } object-contain`}
              />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-white font-bold text-xl leading-tight">
                  ScriptHive
                </h2>
                <p className="text-scripthive-gold text-sm">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-scripthive-gold/70 font-semibold tracking-wide">
            {!isCollapsed ? "MAIN MENU" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-12 transition-all duration-200 hover:bg-scripthive-gold/10 ${
                        isActive
                          ? "bg-scripthive-gold text-scripthive-black font-semibold shadow"
                          : "text-white hover:text-scripthive-gold"
                      }`}
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg"
                      >
                        <Icon size={20} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
