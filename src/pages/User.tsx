/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id?: string;
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  active?: boolean;
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://onlinewriting.onrender.com/api/open/users");
        const data = await response.json();
        if (response.ok && data.status === "success") {
          setUsers(data.body);
        } else {
          throw new Error(data.message || "Failed to fetch users");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleDelete = async (userId: string | number) => {
    try {
      const response = await fetch(`https://onlinewriting.onrender.com/api/open/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userId && u._id !== userId)
      );
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex-1 bg-scripthive-gray-light p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-scripthive-black mb-6">
          Manage Users
        </h1>

        {loading ? (
          <p className="text-scripthive-gray-dark">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-scripthive-gray-dark">No users found.</p>
        ) : (
          <div className="overflow-x-auto bg-white/90 rounded-xl p-4 shadow border border-gray-200">
            <table className="w-full table-auto text-left">
              <thead className="bg-scripthive-gold text-scripthive-black">
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = user.id || user._id;
                  const isActive = user.active ?? false;

                  return (
                    <tr key={userId} className="border-t border-gray-200 hover:bg-scripthive-gold/5">
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.phone}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => {
                              // Optional: toggle logic
                            }}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isActive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isActive ? "Active" : "Not Active"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(userId!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
