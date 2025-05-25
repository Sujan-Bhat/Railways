import Head from "next/head";
import { useEffect, useState } from "react";

interface Train {
  train_id: number;
  train_number: string;
  train_name: string;
  type: string;
  total_coaches: number;
}

export default function RemoveTrain() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrainId, setSelectedTrainId] = useState<number | null>(null);

  async function fetchTrains() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deltrain");
      if (!res.ok) throw new Error("Failed to fetch trains");
      const data = await res.json();
      setTrains(data.trains);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrains();
  }, []);

  const openDeleteModal = (train_id: number) => {
    setSelectedTrainId(train_id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedTrainId(null);
  };

  async function confirmDelete() {
    if (!selectedTrainId) return;
    setDeletingId(selectedTrainId);

    try {
      const res = await fetch("/api/deltrain/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ train_id: selectedTrainId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete train");

      // Remove the deleted train from the list
      setTrains((prev) => prev.filter((t) => t.train_id !== selectedTrainId));
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  }

  return (
    <>
      <Head>
        <title>Remove Train</title>
      </Head>

      {/* Outer container using a plain white background */}
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-black">Remove Train 🚆</h1>

        {loading && <p className="text-gray-600">Loading trains...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && trains.length === 0 && (
          <p className="text-gray-600">No trains found in the system.</p>
        )}

        {!loading && trains.length > 0 && (
          <div className="overflow-x-auto w-full max-w-6xl rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Train Number</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Train Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Total Coaches</th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train) => (
                  <tr key={train.train_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-black">{train.train_id}</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold text-black">{train.train_number}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{train.train_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{train.type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{train.total_coaches}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => openDeleteModal(train.train_id)}
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

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-bold text-black mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this train?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === selectedTrainId}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition duration-200"
                >
                  {deletingId === selectedTrainId ? "Deleting..." : "Yes, Delete"}
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
      </div>
    </>
  );
}


