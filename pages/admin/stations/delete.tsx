import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

interface Station {
  station_id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
}

export default function ViewStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await fetch("/api/stations/getAll");
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data.stations);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStation = async (station_id: number) => {
    if (!confirm("Are you sure you want to delete this station?")) return;

    try {
      const res = await fetch(`/api/stations/delete?station_id=${station_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete station");
      setStations((prev) => prev.filter((s) => s.station_id !== station_id));
    } catch (error) {
      console.error("Error deleting station:", error);
    }
  };

  return (
    <>
      <Head>
        <title>View Stations</title>
      </Head>
      {/* Outer container with a plain white background */}
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        {/* Central card container */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Station List</h1>

          {loading ? (
            <p className="text-center text-black">Loading...</p>
          ) : stations.length === 0 ? (
            <p className="text-center text-black">No stations found.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left text-black">Code</th>
                    <th className="p-2 text-left text-black">Name</th>
                    <th className="p-2 text-left text-black">City</th>
                    <th className="p-2 text-left text-black">State</th>
                    <th className="p-2 text-center text-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station) => (
                    <tr key={station.station_id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-black">{station.station_code}</td>
                      <td className="p-2 text-black">{station.station_name}</td>
                      <td className="p-2 text-black">{station.city}</td>
                      <td className="p-2 text-black">{station.state}</td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteStation(station.station_id);
                          }}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/admin/stations/station"
              className="text-black hover:underline"
            >
              ← Back to Station Management
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

