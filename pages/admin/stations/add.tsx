"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

const stationList = [
  { station_name: "New Delhi", city: "Delhi", state: "Delhi" },
  { station_name: "Mumbai Central", city: "Mumbai", state: "Maharashtra" },
  { station_name: "Howrah Junction", city: "Kolkata", state: "West Bengal" },
  { station_name: "Chennai Central", city: "Chennai", state: "Tamil Nadu" },
  { station_name: "Bangalore City", city: "Bangalore", state: "Karnataka" },
  { station_name: "Secunderabad", city: "Hyderabad", state: "Telangana" },
  { station_name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat" },
  { station_name: "Lucknow NR", city: "Lucknow", state: "Uttar Pradesh" },
  { station_name: "Patna Junction", city: "Patna", state: "Bihar" },
  { station_name: "Kanpur Central", city: "Kanpur", state: "Uttar Pradesh" },
  // Add more stations as needed
];

export default function AddStation() {
  const [stationCode, setStationCode] = useState("");
  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [filteredStations, setFilteredStations] = useState<typeof stationList>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stationName.trim() === "") {
      setFilteredStations([]);
      setCity("");
      setState("");
      setShowSuggestions(false);
      return;
    }
    const filtered = stationList.filter((station) =>
      station.station_name.toLowerCase().includes(stationName.toLowerCase())
    );
    setFilteredStations(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [stationName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (station: typeof stationList[0]) => {
    setShowSuggestions(false); // Close dropdown first
    setStationName(station.station_name);
    setCity(station.city);
    setState(station.state);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stationCode.trim() || !stationName.trim() || !city.trim() || !state.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ station_code: stationCode, station_name: stationName, city, state }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add station");
      } else {
        setSuccess("Station added successfully!");
        setStationCode("");
        setStationName("");
        setCity("");
        setState("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Station</title>
        <style>{`
          /* Animate dropdown fade and slide */
          .suggestions-enter {
            opacity: 0;
            transform: translateY(-8px);
          }
          .suggestions-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 200ms ease, transform 200ms ease;
          }
          .suggestions-exit {
            opacity: 1;
            transform: translateY(0);
          }
          .suggestions-exit-active {
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 200ms ease, transform 200ms ease;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Add Station
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <input
              type="text"
              placeholder="Station Code (e.g. NDLS)"
              value={stationCode}
              onChange={(e) => setStationCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="off"
            />

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Station Name"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="off"
                required
                onFocus={() => {
                  if (filteredStations.length > 0) setShowSuggestions(true);
                }}
              />
              {showSuggestions && (
                <ul
                  ref={suggestionsRef}
                  className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-y-auto mt-1 shadow-lg
                    transition-opacity duration-200 ease-in-out
                    opacity-100
                    transform translate-y-0
                  "
                  // You could toggle opacity/transform here dynamically for more control
                >
                  {filteredStations.map((station) => (
                    <li
                      key={station.station_name}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectSuggestion(station)}
                    >
                      {station.station_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {success && <p className="text-green-600 font-semibold">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
            >
              {loading ? "Adding Station..." : "Add Station"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/stations" legacyBehavior>
              <a className="text-blue-600 hover:underline cursor-pointer font-semibold">
                &larr; Back to Stations
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}