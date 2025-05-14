"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [location, setLocation] = useState(null);

  const [serialNumbers, setSerialNumbers] = useState([
    { id: 1, number: "152ds4", status: "claimed" },
    { id: 2, number: "89er3d", status: "unclaim" },
    { id: 3, number: "45trg2", status: "claimed" },
    { id: 4, number: "zxc123", status: "unclaim" },
    { id: 5, number: "rt67uh", status: "claimed" },
    { id: 6, number: "mnbv9k", status: "unclaim" },
  ]);

  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) {
      setResult(null);
      return;
    }

    const match = serialNumbers.find(
      (item) => item.number.toLowerCase() === trimmed
    );

    if (match) {
      setResult({
        found: true,
        number: match.number,
        status: match.status === "claimed" ? "CLAIMED" : "UNCLAIMED",
      });
    } else {
      setResult({ found: false, number: trimmed });
    }
  };

  const handleClaim = () => {
    const updatedSerials = serialNumbers.map((item) => {
      if (item.number.toLowerCase() === search.trim().toLowerCase()) {
        return { ...item, status: "claimed" };
      }
      return item;
    });

    setSerialNumbers(updatedSerials);

    // Re-check the updated status
    const updatedMatch = updatedSerials.find(
      (item) => item.number.toLowerCase() === search.trim().toLowerCase()
    );

    if (updatedMatch) {
      setResult({
        found: true,
        number: updatedMatch.number,
        status: "CLAIMED",
      });
    }
  };

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        console.log("User Location Info:", data.ip); // 👈 View full info
        if (data.ip != "103.83.224.133") {
          alert("You are not allowed to access this page.");
          window.location.href = "https://www.google.com";
        }
        setLocation(data);
      })
      .catch((err) => console.error("Error fetching location:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl">PROJECT JAEGER - XP+ SOFTDEV</h1>
      <div className="p-8">
        <h1 className="text-2xl">User Info</h1>
        {location && (
          <div className="mt-4 text-gray-700">
            <p>
              <strong>IP:</strong> {location.ip}
            </p>
            <p>
              <strong>City:</strong> {location.city}
            </p>
            <p>
              <strong>Region:</strong> {location.region}
            </p>
            <p>
              <strong>Country:</strong> {location.country_name}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-5">
        <div className="w-1/3 h-full mt-10">
          <strong>Serial Number</strong>
          <input
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            type="text"
            placeholder="Enter serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 cursor-pointer w-full"
            onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="w-full h-full mt-10 text-center">
          {result !== null && (
            <div>
              <h1
                className={`text-4xl font-bold ${
                  !result.found
                    ? "text-red-600"
                    : result.status === "CLAIMED"
                    ? "text-gray-600"
                    : "text-green-600"
                }`}>
                {result.found
                  ? result.status !== "CLAIMED"
                    ? `${result.number.toUpperCase()} FOUND`
                    : result.number.toUpperCase()
                  : `${result.number.toUpperCase()} NOT FOUND`}{" "}
                {result.status === "CLAIMED" ? "CLAIMED" : ""}
              </h1>

              {result.found && result.status !== "CLAIMED" && (
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                  onClick={handleClaim}>
                  Claim
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
