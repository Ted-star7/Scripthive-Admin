import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();

  const [fullName, setFullName] = useState("Admin");
  const [userName, setUserName] = useState("admin");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const session = localStorage.getItem("session");
  const userId = session ? JSON.parse(session).body.userId : null;

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://onlinewriting.onrender.com/api/open/users/${userId}`);
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setFullName(data.body.fullName);
          setUserName(data.body.userName);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(
          `https://onlinewriting.onrender.com/api/open/users/${userId}/profile-picture`
        );
        const data = await response.json();

        if (response.ok && data.status === "success" && data.body) {
          setImageUrl(data.body);
        }
      } catch (err) {
        console.error("Profile picture fetch error:", err);
      }
    };

    fetchProfile();
    fetchProfilePicture();
  }, [userId]);

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "We’re signing you out. Please wait.",
      duration: 2000,
    });

    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 1500);
  };

  const handleProfile = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://onlinewriting.onrender.com/api/open/users/${userId}`
      );
      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to fetch profile");
      }

      navigate("/profile", { state: { profile: data.body } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Profile Fetch Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="border-b border-scripthive-gray-dark/10 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-scripthive-black hover:text-scripthive-gold" />

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search scripts, users, or transactions..."
              className="pl-10 w-80 border-gray-200 focus:border-scripthive-gold focus:ring-scripthive-gold"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-scripthive-black hover:text-scripthive-gold hover:bg-scripthive-gold/10"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">3</span>
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-scripthive-gold/10">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={imageUrl || "/default-avatar.png"}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-scripthive-gold text-scripthive-black font-semibold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-scripthive-black">{fullName}</p>
                  <p className="text-xs text-scripthive-gray-dark">{userName}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="hover:bg-scripthive-gold/10">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-scripthive-gold/10">Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-scripthive-gold/10">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
