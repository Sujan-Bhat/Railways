"use client";

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

export default function RemoveStation() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  async function fetchStations() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stations/getAll");
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data.stations);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStations();
  }, []);

  const openDeleteModal = (station_id: number) => {
    setSelectedStationId(station_id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedStationId(null);
  };

  async function confirmDelete() {
    if (!selectedStationId) return;
    setDeletingId(selectedStationId);

    try {
      const res = await fetch(`/api/stations/delete?station_id=${selectedStationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete station");

      // Remove the deleted station from the list
      setStations((prev) => prev.filter((s) => s.station_id !== selectedStationId));
    } catch (err: any) {
      console.error("Error deleting station:", err);
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  }

  return (
    <>
      <Head>
        <title>Remove Station </title>
      </Head>

      <div className="min-h-screen bg-[#ECF0F1] p-6 flex flex-col items-center text-[#2C3E50]">
        <h1 className="text-4xl font-bold mb-6 text-[#2C3E50]">Remove Station 🚉</h1>

        {loading && <p className="text-[#95A5A6]">Loading stations...</p>}
        {error && <p className="text-[#E74C3C] mb-4">{error}</p>}
        {!loading && stations.length === 0 && (
          <p className="text-gray-600 text-black">No stations found.</p>
        )}

        {!loading && stations.length > 0 && (
          <div className="overflow-x-auto w-full max-w-6xl rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-[#2C3E50] text-[#ECF0F1]">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Code</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Station-Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">City</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">State</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.station_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-black">{station.station_id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{station.station_code}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{station.station_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{station.city}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{station.state}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => openDeleteModal(station.station_id)}
                        className="px-3 py-1 rounded bg-[#E74C3C] hover:bg-[#C0392B] text-white font-semibold transition duration-200"
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

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this station?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === selectedStationId }
                  className="bg-[#E74C3C] hover:bg-[#C0392B] text-white px-4 py-2 rounded font-semibold transition duration-200"
                >
                  {deletingId === selectedStationId ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center color-">
          <Link href="/admin/stations/station" className="text-blue-600 hover:underline font-semibold">
            ← Back to Station Management
          </Link>
        </div>
      </div>
    </>
  );
}




