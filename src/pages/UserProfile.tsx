import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    username: "",
    email: "",
    role: "",
    password: "changeme123",
    phone: "",
  });

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

        const { fullName, username, email, role, phone } = data.body;

        const userProfile: ProfileData = {
          fullName,
          username,
          email,
          role,
          password: "changeme123",
          phone: phone || "",
        };

        setProfile(userProfile);
        setFormData(userProfile);
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
        setImageUrl(null);
      }
    };

    fetchProfileDetails();
    fetchProfilePictureUrl();
  }, [userId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile || !userId) return;

    const form = new FormData();
    form.append("file", selectedFile);

    try {
      const res = await fetch(
        `https://onlinewriting.onrender.com/api/open/users/${userId}/profile-picture`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Upload failed");
      }

      setImageUrl(data.body);
      setSelectedFile(null);
      toast({ title: "Success", description: "Profile picture uploaded successfully" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://onlinewriting.onrender.com/api/open/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(formData);
      setEditMode(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scripthive-gray-light flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl bg-white px-6 py-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-scripthive-gray-dark/10">
        <div>
          <h1 className="text-3xl font-extrabold text-scripthive-gold tracking-tight">
            Admin Profile
          </h1>
          <p className="text-scripthive-black text-sm mt-1">
            View and manage your account details below
          </p>
          <div className="mt-2 w-20 h-1 bg-scripthive-gold rounded-full"></div>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {editMode ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
              <Button
                onClick={() => {
                  setEditMode(false);
                  if (profile) setFormData(profile);
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              className="bg-scripthive-gold hover:bg-scripthive-gold-dark text-scripthive-black"
            >
              Edit Profile
            </Button>
          )}
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-black"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 w-full flex justify-center items-center p-6 animate-fade-in">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200 text-scripthive-black space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-scripthive-gold"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                <Button
                  onClick={handleUploadPicture}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                >
                  Upload Picture
                </Button>
              </>
            )}
          </div>

          {/* Editable Info */}
          <div className="text-left space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 border-scripthive-gold">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Username", name: "username" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
              ].map(({ label, name }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-semibold">{label}</label>
                  {editMode ? (
                    <input
                      name={name}
                      value={(formData as any)[name]}
                      onChange={handleChange}
                      className="border border-gray-300 focus:border-scripthive-gold focus:ring-2 focus:ring-scripthive-gold/30 transition px-3 py-2 w-full rounded-md text-sm"
                    />
                  ) : (
                    <p className="text-sm">{(profile as any)[name]}</p>
                  )}
                </div>
              ))}
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold">Role</label>
                <p className="text-sm">{profile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
