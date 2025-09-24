import React, { useState, useEffect } from "react";
import { fetchTemples } from "../../../utils/api"; // API helper

export default function TempleSelector({ selectedTemple, onSelect }) {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTemples = async () => {
      try {
        setLoading(true);
        let data = await fetchTemples(); // fetch from backend

        // Transform backend data to match UI expectations
        if (data && data.length > 0) {
          data = data.map((temple) => ({
            id: temple.id || temple._id,
            name: temple.name,
            location: temple.location || "Location not available",
            image:
              temple.image ||
              "https://via.placeholder.com/400x300?text=Temple+Image",
            capacity: temple.capacity || 500,
            openTime: temple.openTime || "06:00",
            closeTime: temple.closeTime || "20:00",
            ticketPrices:
              temple.ticketPrices || { regular: 50, vip: 200, senior: 25 },
            description: temple.description,
          }));
        } else {
          setError("No temples available at the moment");
        }

        setTemples(data);
      } catch (err) {
        console.error("Failed to fetch temples:", err);
        setError("Failed to load temples");
      } finally {
        setLoading(false);
      }
    };

    loadTemples();
  }, []);

  if (loading) return <p>Loading temples...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {temples.map((temple) => (
        <div
          key={temple.id}
          className={`border rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-200 ${
            selectedTemple?.id === temple.id
              ? "border-primary bg-primary/10"
              : "border-gray-200"
          }`}
        >
          <img
            src={temple.image}
            alt={temple.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold mb-1">{temple.name}</h3>
          <p className="text-gray-600 mb-2">{temple.location}</p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Capacity:</span> {temple.capacity}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Open:</span> {temple.openTime} -{" "}
            {temple.closeTime}
          </p>
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Ticket Prices:</p>
            <ul className="text-gray-600 text-sm">
              <li>Regular: ₹{temple.ticketPrices.regular}</li>
              <li>VIP: ₹{temple.ticketPrices.vip}</li>
              <li>Senior: ₹{temple.ticketPrices.senior}</li>
            </ul>
          </div>
          <button
            className={`w-full py-2 rounded font-semibold text-white ${
              selectedTemple?.id === temple.id
                ? "bg-success"
                : "bg-primary hover:bg-primary-dark"
            }`}
            onClick={() => onSelect(temple)}
          >
            {selectedTemple?.id === temple.id ? "Selected" : "Select"}
          </button>
        </div>
      ))}
    </div>
  );
}
