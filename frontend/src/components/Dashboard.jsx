import { useEffect, useState } from "react";
import { getSensors, getStats } from "../api/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [sensors, setSensors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensorRes = await getSensors();
        const statsRes = await getStats();

        setSensors(sensorRes.data || []);
        setStats(statsRes.data || {});
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = sensors
    .slice(-10)
    .map((s) => ({
      // the backend returns a `timestamp` field, not `created_at`
      time: new Date(s.timestamp).toLocaleTimeString(),
      temperature: s.temperature,
      humidity: s.humidity,
    }));

  const alerts = sensors.filter((s) => s.temperature > 40);


  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  // show friendly message when no measurements exist yet
  if (!loading && sensors.length === 0) {
    const handleSeed = async () => {
      try {
        await fetch("http://localhost:8000/seed", { method: "POST" });
        // refetch immediately
        setLoading(true);
        const sensorRes = await getSensors();
        const statsRes = await getStats();
        setSensors(sensorRes.data || []);
        setStats(statsRes.data || {});
      } catch (e) {
        console.error("failed to seed", e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        No sensor data available.
        <br />
        <button
          onClick={handleSeed}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Seed sample data
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        📊 Dashboard Overview
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Messages" value={stats.total_messages ?? 0} color="blue" />
        <StatCard title="Total Alerts" value={stats.total_alerts ?? 0} color="red" />
        <StatCard title="Active Alerts" value={alerts.length} color="green" />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">

        {/* Temperature */}
        <ChartCard title="🌡 Temperature" >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke={alerts.length > 0 ? "#ef4444" : "#3b82f6"}
                fill={alerts.length > 0 ? "#ef4444" : "#3b82f6"}
                fillOpacity={0.2}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Humidity */}
        <ChartCard title="💧 Humidity">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ===== RECENT ALERTS ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">🚨 Recent Alerts</h2>

        {alerts.length === 0 ? (
          <p className="text-green-600 font-medium">No active alerts</p>
        ) : (
          alerts.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="border-l-4 border-red-500 bg-red-50 p-4 mb-3 rounded-lg"
            >
              High temperature detected ({a.temperature}°C)
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} text-white p-6 rounded-2xl shadow-xl`}
    >
      <h2 className="opacity-80">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}