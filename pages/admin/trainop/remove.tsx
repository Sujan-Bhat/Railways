import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Using next/router for pages directory

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

  const router = useRouter();

  async function fetchTrains() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deltrain"); // Your API to fetch trains
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
      console.error("Error deleting train:", err);
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

      <div className="min-h-screen bg-[#ECF0F1] p-4 md:p-6 flex flex-col items-center text-[#2C3E50]">
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#2C3E50] text-center">
            Remove Train 🚆
          </h1>

          {loading && <p className="text-[#95A5A6]">Loading trains...</p>}
          {error && <p className="text-[#E74C3C] mb-4">{error}</p>}
          {!loading && trains.length === 0 && (
            <p className="text-[#95A5A6]">No trains found in the system.</p>
          )}

          {!loading && trains.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-[#2C3E50] text-[#ECF0F1]">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Train Number</th>
                    <th className="px-4 py-3 text-left">Train Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Total Coaches</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[#2C3E50]">
                  {trains.map((train) => (
                    <tr
                      key={train.train_id}
                      className="border-b border-[#95A5A6] last:border-b-0 hover:bg-gray-100"
                    >
                      <td className="px-4 py-3">{train.train_id}</td>
                      <td className="px-4 py-3 font-semibold">
                        {train.train_number}
                      </td>
                      <td className="px-4 py-3">{train.train_name}</td>
                      <td className="px-4 py-3">{train.type}</td>
                      <td className="px-4 py-3">{train.total_coaches}</td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => openDeleteModal(train.train_id)}
                          className="px-4 py-2 rounded bg-[#E74C3C] hover:bg-[#C0392B] text-white font-semibold transition duration-200"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/trainop/edit?train_id=${train.train_id}`
                            )
                          }
                          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-200"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Confirmation Modal for Delete */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#ECF0F1] rounded-xl shadow-lg p-6 w-full max-w-md text-center text-[#2C3E50]">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="text-[#4A4A4A] mb-6">
                  Are you sure you want to delete this train?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDelete}
                    disabled={deletingId === selectedTrainId}
                    className="bg-[#E74C3C] hover:bg-[#C0392B] text-white px-4 py-2 rounded font-semibold transition duration-200"
                  >
                    {deletingId === selectedTrainId ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={closeDeleteModal}
                    className="bg-[#95A5A6] hover:bg-[#7F8C8D] text-[#2C3E50] px-4 py-2 rounded font-semibold transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

