import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";


import { AppSidebar } from "@/components/AppSidebar"; // 👈 Make sure path is correct


interface Project {
  id: string;
  projectTitle: string;
  category: string;
  status: string | null;
  dueDate: string | null;
  dueTime: string | null;
  paymentBudget: number;
  repositoryUrl: string;
  deployment: string;
  hosting: string;
}

const ScriptsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://onlinewriting.onrender.com/api/open/projects");
        const data = await res.json();
        if (data.status === "success") {
          setProjects(data.data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusColor = (status: string | null | undefined) => {
    const safeStatus = status?.toLowerCase() || "";

    switch (safeStatus) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />

      {/* Page Content */}
      <div className="flex-1 bg-scripthive-gray-light p-6 overflow-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-scripthive-black mb-6">Posted Scripts</h1>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-scripthive-gold" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-white/90 border border-gray-200 shadow-lg backdrop-blur-md hover:shadow-xl transition"
              >
                <CardHeader className="flex justify-between items-start">
                  <CardTitle className="text-scripthive-black text-lg">
                    {project.projectTitle}
                  </CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status || "Unknown"}
                  </Badge>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-scripthive-black">
                  <p><strong>Category:</strong> {project.category}</p>
                  <p><strong>Due:</strong> {project.dueDate ?? "N/A"} {project.dueTime ?? ""}</p>
                  <p><strong>Budget:</strong> KES {project.paymentBudget}</p>
                  <p><strong>Hosting:</strong> {project.hosting}</p>
                  <p><strong>Deployment:</strong> {project.deployment}</p>
                  <p>
                    <strong>Repo:</strong>{" "}
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptsPage;
