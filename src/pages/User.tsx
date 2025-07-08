import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
      } catch (error) {
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
  }, [toast] );

  return (
    <div className="min-h-screen bg-scripthive-gray-light p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-scripthive-black">Manage Users</h1>
        <Button
          className="bg-scripthive-gold hover:bg-scripthive-gold-dark text-scripthive-black font-medium"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {loading ? (
        <p className="text-scripthive-gray-dark">Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-white/90 rounded-xl p-4 shadow border border-gray-200">
          <table className="w-full table-auto text-left">
            <thead className="bg-scripthive-gold text-scripthive-black">
              <tr>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 hover:bg-scripthive-gold/5">
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default User;
