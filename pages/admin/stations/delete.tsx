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
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Station List</h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : stations.length === 0 ? (
            <p className="text-center text-gray-500">No stations found.</p>
          ) : (
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Code</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">City</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.station_id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{station.station_code}</td>
                    <td className="p-2">{station.station_name}</td>
                    <td className="p-2">{station.city}</td>
                    <td className="p-2">{station.state}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteStation(station.station_id);
                        }}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-6 text-center">
            <Link href="/admin/stations/station" className="text-blue-600 hover:underline">
              ← Back to Station Management
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}