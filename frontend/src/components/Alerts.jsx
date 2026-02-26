import { useEffect, useState } from "react";
import { getAlerts } from "../api/api";
import alertGraphic from "../assets/alert.svg";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-red-600 flex items-center gap-4">
            <img src={alertGraphic} alt="alert" className="w-24 h-24" />
            <span className="leading-none">TRIGGERED ALERTS</span>
          </h1>
        </div>

        {alerts.length === 0 ? (
          <p className="text-center text-gray-500 italic text-lg">
            No active alerts. Everything looks good ✅
          </p>
        ) : (
          <div className="space-y-8">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white border-l-4 border-red-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <h2 className="text-xl font-bold text-red-700">
                      ⚠ {alert.topic}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Device ID:{" "}
                      <span className="font-mono text-gray-700">
                        {alert.device_id || "Unknown"}
                      </span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* VIOLATED PARAMETERS */}
                <div className="mt-6">
<p className="text-sm font-semibold text-gray-600 mb-3">
                    Violated Sensor Parameters:
                  </p>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {alert.violated_keys?.map((key) => (
                      <div
                        key={key}
                        className="bg-red-50 border border-red-200 rounded-xl p-4"
                      >
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {key}
                        </p>

                        <p className="text-lg font-bold text-red-600 mt-1">
                          {alert.actual_values?.[key]}
                        </p>

                        {alert.thresholds?.[key] && (
                          <p className="text-xs text-gray-500 mt-1">
                            Threshold: {alert.thresholds[key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}