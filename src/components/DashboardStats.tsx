
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "Total Scripts",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    color: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "8,934",
    change: "+8.2%",
    trend: "up",
    color: "bg-green-500",
  },
  {
    title: "Pending Reviews",
    value: "23",
    change: "-15.3%",
    trend: "down",
    color: "bg-orange-500",
  },
  {
    title: "Revenue",
    value: "$45,238",
    change: "+23.1%",
    trend: "up",
    color: "bg-scripthive-gold",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="animate-slide-in border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-scripthive-gray-dark font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-scripthive-black">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <div className="w-6 h-6 bg-white rounded opacity-80"></div>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              {stat.trend === "up" ? (
                <TrendingUp className="text-green-500 w-4 h-4 mr-2" />
              ) : (
                <TrendingDown className="text-red-500 w-4 h-4 mr-2" />
              )}
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
              <span className="text-sm text-scripthive-gray-dark ml-2">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
