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
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null);

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

  const confirmDelete = (station: Station) => {
    setStationToDelete(station);
  };

  const cancelDelete = () => {
    setStationToDelete(null);
  };

  const deleteStation = async () => {
    if (!stationToDelete) return;
    try {
      const res = await fetch(`/api/stations/delete?station_id=${stationToDelete.station_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete station");
      setStations((prev) => prev.filter((s) => s.station_id !== stationToDelete.station_id));
      setStationToDelete(null);
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
                        onClick={() => confirmDelete(station)}
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
            <Link href="/admin/stations" className="text-blue-600 hover:underline">
              ← Back to Station Management
            </Link>
          </div>
        </div>

        {/* Custom Confirmation Modal */}
        {stationToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Confirm Delete
              </h2>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete station <strong>{stationToDelete.station_name}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={deleteStation}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}