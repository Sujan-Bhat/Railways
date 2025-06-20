"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../src/app/layout/header";
import Footer from "../src/app/layout/footer";

interface Schedule {
  schedule_id: number;
  train_name: string;
  station_name: string;
  arrival_time: string;
  departure_time: string;
  city: string;
}

export default function ViewTrainSchedules() {
  // States for schedules, toggling, loading, error, and search
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openStations, setOpenStations] = useState<{ [station: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/train_schedules/view");
        if (!res.ok) throw new Error("Failed to fetch schedules");
        const data = await res.json();
        setSchedules(data.schedules);
      } catch (err: any) {
        setError(err.message || "Error fetching schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  // Group schedules by station name.
  const groupByStation = (arr: Schedule[]) =>
    arr.reduce((acc, schedule) => {
      const station = schedule.station_name;
      if (!acc[station]) {
        acc[station] = [];
      }
      acc[station].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);

  const groupedSchedules = groupByStation(schedules);

  // Filter the grouped results based on search term.
  const filteredGroups = Object.entries(groupedSchedules).filter(([station, schList]) => {
    if (!searchTerm.trim()) return true; // if search term is empty, show everything
    const lowerSearch = searchTerm.toLowerCase();
    // Check if either the station name or the station's city contains the search term.
    return (
      station.toLowerCase().includes(lowerSearch) ||
      (schList[0]?.city?.toLowerCase() || "").includes(lowerSearch)
    );
  });

  // Toggle dropdown visibility for a station.
  const toggleStation = (station: string) => {
    setOpenStations((prev) => ({
      ...prev,
      [station]: !prev[station],
    }));
  };

  return (
    <>
      <Head>
        <title>Train Schedules</title>
      </Head>
      <Header />
      <div className="min-h-screen bg-[#ECF0F1] p-6 flex flex-col items-center text-[#2C3E50]">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Train Schedules</h1>

          {/* Search Input */}
          <div className="w-full mb-6">
            <input
              type="text"
              placeholder="Search by station or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center">{error}</p>}
          {filteredGroups.length === 0 && !loading && (
            <p className="text-center">No schedules available.</p>
          )}

          {filteredGroups.map(([station, schList]) => {
            const city = schList[0]?.city || "";
            return (
              <div key={station} className="mb-8">
                {/* Station Header */}
                <div
                  className="flex items-center justify-between bg-gray-200 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
                  onClick={() => toggleStation(station)}
                >
                  <span className="font-bold text-xl">{station}</span>
                  <span className="text-lg">City: {city}</span>
                </div>
                {/* Schedule Table Dropdown */}
                {openStations[station] && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                      <thead className="bg-[#2C3E50] text-[#ECF0F1]">
                        <tr>
                          <th className="border px-4 py-2 text-center">Schedule-ID</th>
                          <th className="border px-4 py-2 text-center">Train Name</th>
                          <th className="border px-4 py-2 text-center">Arrival</th>
                          <th className="border px-4 py-2 text-center">Departure</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schList.map((sch) => (
                          <tr key={sch.schedule_id} className="border-b hover:bg-gray-50">
                            <td className="border px-4 py-2">{sch.schedule_id}</td>
                            <td className="border px-4 py-2">{sch.train_name}</td>
                            <td className="border px-4 py-2">{sch.arrival_time}</td>
                            <td className="border px-4 py-2">{sch.departure_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

