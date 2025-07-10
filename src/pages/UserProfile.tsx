import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  fullName: string;
  userName: string;
  email: string;
  role: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const session = localStorage.getItem("session");
  const userId = session ? JSON.parse(session).body.userId : null;

  useEffect(() => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found in session",
        variant: "destructive",
      });
      return;
    }

    const fetchProfileDetails = async () => {
      try {
        const res = await fetch(`https://onlinewriting.onrender.com/api/open/users/${userId}`);
        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch profile");
        }

        const { fullName, userName, email, role } = data.body;
        setProfile({ fullName, userName, email, role });
      } catch (err) {
        toast({
          title: "Failed to load profile",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      }
    };

    const fetchProfilePictureUrl = async () => {
      try {
        const res = await fetch(
          `https://onlinewriting.onrender.com/api/open/users/${userId}/profile-picture`
        );
        const data = await res.json();

        if (res.ok && data.status === "success" && data.body) {
          setImageUrl(data.body);
        }
      } catch (err) {
        console.error("Error loading profile picture:", err);
        setImageUrl(null); // fallback
      }
    };

    fetchProfileDetails();
    fetchProfilePictureUrl();
  }, [userId, toast]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scripthive-gray-light flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-scripthive-gray-dark/10">
        <h1 className="text-2xl font-bold text-scripthive-black">Admin Profile</h1>
        <Button
          className="bg-scripthive-gold hover:bg-scripthive-gold-dark text-scripthive-black font-medium"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Content */}
      <main className="flex-1 flex justify-center items-center p-8 animate-fade-in">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200 text-scripthive-black text-center space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src={imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-scripthive-gold"
            />
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{profile.fullName}</h2>
            <p className="text-sm text-scripthive-gray-dark">@{profile.userName}</p>
          </div>

          {/* Details */}
          <div className="text-left space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <p><strong>Full Name:</strong> {profile.fullName}</p>
            <p><strong>Username:</strong> {profile.userName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role || "N/A"}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
