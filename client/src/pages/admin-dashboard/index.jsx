import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

export default function AdminDashboard() {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    // Request initial visitor data
    socket.emit("requestVisitorData");

    socket.on("initialVisitorData", (data) => {
      setTemples(data.map(d => ({ templeId: d.templeId, visitors: d.visitors })));
    });

    // Listen for real-time updates
    socket.on("visitorUpdate", (update) => {
      setTemples(prev =>
        prev.map(t => t.templeId === update.templeId ? { ...t, visitors: update.visitors } : t)
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temples.map((temple) => (
          <div key={temple.templeId} className="p-4 border rounded shadow">
            <h2 className="font-semibold">Temple ID: {temple.templeId}</h2>
            <p>Current Visitors: {temple.visitors}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
