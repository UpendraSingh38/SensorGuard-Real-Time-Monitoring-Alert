import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import RawData from "./components/RawData";

export default function App() {
  return (
    <BrowserRouter>
      {/* Top Navigation */}
<nav className="bg-white shadow-md px-8 py-4 flex gap-8 text-lg font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/alerts"
            className="text-gray-700 hover:text-red-600 transition"
          >
            Alerts
          </Link>

          <Link
            to="/raw"
            className="text-gray-700 hover:text-green-600 transition"
          >
            Raw Data
          </Link>
        </nav>

      {/* Page Content */}
      <div className="p-8 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/raw" element={<RawData />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}