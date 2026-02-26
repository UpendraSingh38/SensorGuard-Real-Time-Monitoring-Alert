import { useEffect, useState } from "react";
import { getSensors } from "../api/api";

export default function RawData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSensors().then(res => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
        📄 Raw Sensor Data
      </h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No sensor records found.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Humidity (%)
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                    {row.topic}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                    {row.temperature}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                    {row.humidity}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}