import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Analytics() {
  const [period, setPeriod] = useState("all");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/assets/stats`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const mapToChartData = (obj) => {
    if (!obj) return [];
    return Object.entries(obj).map(([name, value]) => ({
      name,
      value,
    }));
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load analytics.
      </div>
    );
  }

const statusData = [
  { name: "Active", value: analytics.activeAssets || 0 },
  { name: "Inactive", value: analytics.inactiveAssets || 0 },
  {
    name: "Other",
    value:
      (analytics.totalAssets || 0) -
      ((analytics.activeAssets || 0) + (analytics.inactiveAssets || 0)),
  },
];

const riskData = [
  { name: "High Risk", value: analytics.highRiskAssets || 0 },
  {
    name: "Normal Risk",
    value: (analytics.totalAssets || 0) - (analytics.highRiskAssets || 0),
  },
];

const typeData = [
  { name: "Total Assets", value: analytics.totalAssets || 0 },
];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Asset Analytics
          </h1>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="mt-4 md:mt-0 border rounded-lg px-4 py-2 bg-white shadow"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Assets</h2>
          <p className="text-4xl font-bold text-blue-700 mt-2">
            {analytics.totalAssets}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Assets by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Assets by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Assets by Risk Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;