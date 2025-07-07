
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", scripts: 89, users: 145 },
  { month: "Feb", scripts: 102, users: 167 },
  { month: "Mar", scripts: 125, users: 198 },
  { month: "Apr", scripts: 143, users: 234 },
  { month: "May", scripts: 156, users: 267 },
  { month: "Jun", scripts: 178, users: 301 },
];

const revenueData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 2800 },
  { month: "Mar", revenue: 3200 },
  { month: "Apr", revenue: 3800 },
  { month: "May", revenue: 4200 },
  { month: "Jun", revenue: 4800 },
];

const categoryData = [
  { name: "Web Scripts", value: 45, color: "#F4B400" },
  { name: "Mobile Apps", value: 25, color: "#1A1A1A" },
  { name: "Desktop Tools", value: 20, color: "#4F46E5" },
  { name: "Others", value: 10, color: "#10B981" },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="animate-fade-in border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-scripthive-black">Scripts & Users Growth</CardTitle>
          <CardDescription>Monthly growth comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Bar dataKey="scripts" fill="#F4B400" radius={4} />
              <Bar dataKey="users" fill="#1A1A1A" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in border-0 shadow-lg" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-scripthive-black">Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F4B400" 
                strokeWidth={3}
                dot={{ fill: "#F4B400", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in border-0 shadow-lg lg:col-span-2" style={{ animationDelay: "400ms" }}>
        <CardHeader>
          <CardTitle className="text-scripthive-black">Script Categories</CardTitle>
          <CardDescription>Distribution of script types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <ResponsiveContainer width="100%" height={300} className="lg:w-1/2">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4 lg:w-1/2 mt-6 lg:mt-0">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-3 p-3 rounded-lg bg-scripthive-gray-light">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-scripthive-black">{item.name}</p>
                    <p className="text-sm text-scripthive-gray-dark">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
