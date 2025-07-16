import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

interface Limit {
  id: string;
  role: string;
  amount: string;
  createdAt?: string;
}

const REGISTRATION_API = "https://onlinewriting.onrender.com/api/open/registration-fee";
const PROJECT_API = "https://onlinewriting.onrender.com/api/open/project-budget-limit";

const RegistrationLimits = () => {
  const { toast } = useToast();

  const [role, setRole] = useState("");
  const [amount, setAmount] = useState("");
  const [budgetRole, setBudgetRole] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const [limits, setLimits] = useState<Limit[]>([]);
  const [projectLimits, setProjectLimits] = useState<Limit[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const res1 = await fetch(REGISTRATION_API);
        const regData = await res1.json();

        if (res1.ok && Array.isArray(regData)) {
          const filtered = regData.filter((item) => item.role !== "string" && item.amount !== "string");
          setLimits(filtered);
        }

        const res2 = await fetch(PROJECT_API);
        const projData = await res2.json();

        if (res2.ok && Array.isArray(projData)) {
          const filtered = projData.filter((item) => item.role !== "string" && item.amount !== "string");
          setProjectLimits(filtered);
        }
      } catch (error) {
        toast({
          title: "Fetch Error",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    };

    fetchLimits();
  }, []);

  const handleSubmit = async () => {
    if (!role || !amount) {
      toast({
        title: "Validation Error",
        description: "Both role and amount are required.",
        variant: "destructive",
      });
      return;
    }

    const isDuplicate = limits.some((l) => l.role === role && l.id !== editingId);
    if (isDuplicate) {
      toast({
        title: "Duplicate Role",
        description: "A limit for this role already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(REGISTRATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, amount }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        toast({
          title: "Success",
          description: editingId ? "Limit updated" : "Limit added",
        });

        const newLimit: Limit = {
          id: data.id,
          role: data.role,
          amount: data.amount,
          createdAt: data.createdAt,
        };

        setLimits((prev) =>
          editingId ? prev.map((item) => (item.id === editingId ? newLimit : item)) : [...prev, newLimit]
        );

        setRole("");
        setAmount("");
        setEditingId(null);
      } else {
        throw new Error("Failed to save registration limit.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleBudgetSubmit = async () => {
    if (!budgetRole || !budgetAmount) {
      toast({
        title: "Validation Error",
        description: "Both role and budget amount are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(PROJECT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: budgetRole, amount: budgetAmount }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        toast({
          title: "Budget Limit Added",
          description: `Budget limit for ${budgetRole} added.`,
        });

        const newLimit: Limit = {
          id: data.id,
          role: data.role,
          amount: data.amount,
          createdAt: data.createdAt,
        };

        setProjectLimits((prev) => [...prev, newLimit]);
        setBudgetRole("");
        setBudgetAmount("");
      } else {
        throw new Error("Failed to add project budget limit.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${REGISTRATION_API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete registration limit.");

      setLimits((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Deleted", description: "Registration limit removed." });
    } catch (error) {
      toast({
        title: "Delete Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (limit: Limit) => {
    setRole(limit.role);
    setAmount(limit.amount);
    setEditingId(limit.id);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 bg-scripthive-gray-light px-8 py-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-scripthive-black mb-2">Registration Fee Settings</h1>
          <p className="text-scripthive-gray-dark mb-8">
            Manage and set registration amounts by role.
          </p>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-scripthive-black">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Role</option>
                  <option value="writer">Writer</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-scripthive-black">
                  Amount (KES)
                </label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={handleSubmit}>
                  {editingId ? "Update Limit" : "Add Limit"}
                </Button>
              </div>
            </div>
          </div>

          {/* Registration Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-12">
            <table className="min-w-full text-sm">
              <thead className="bg-scripthive-black text-white">
                <tr>
                  <th className="text-left py-4 px-6">Role</th>
                  <th className="text-left py-4 px-6">Amount</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {limits.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-scripthive-gray-dark">
                      No registration limits set yet.
                    </td>
                  </tr>
                ) : (
                  limits.map((limit) => (
                    <tr key={limit.id} className="border-t border-gray-100">
                      <td className="py-4 px-6 capitalize">{limit.role}</td>
                      <td className="py-4 px-6">{limit.amount}</td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(limit)}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(limit.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Project Budget Limit Section */}
          <h2 className="text-2xl font-bold text-scripthive-black mb-4">Project Budget Limit</h2>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-scripthive-black">Role</label>
                <select
                  value={budgetRole}
                  onChange={(e) => setBudgetRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Role</option>
                  <option value="writer">Writer</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-scripthive-black">
                  Budget Amount (KES)
                </label>
                <Input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={handleBudgetSubmit}>
                  Save Budget Limit
                </Button>
              </div>
            </div>
          </div>

          {/* Optional: Budget Limit Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-scripthive-black text-white">
                <tr>
                  <th className="text-left py-4 px-6">Role</th>
                  <th className="text-left py-4 px-6">Budget Amount</th>
                </tr>
              </thead>
              <tbody>
                {projectLimits.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-scripthive-gray-dark">
                      No project budget limits set yet.
                    </td>
                  </tr>
                ) : (
                  projectLimits.map((limit) => (
                    <tr key={limit.id} className="border-t border-gray-100">
                      <td className="py-4 px-6 capitalize">{limit.role}</td>
                      <td className="py-4 px-6">{limit.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationLimits;
