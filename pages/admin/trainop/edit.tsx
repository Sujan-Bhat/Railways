"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CoachDetail {
  coach_id?: number; // Existing rows will include this.
  coachType: string;
  capacity: string;
  coachNumber?: string;
}

interface TrainData {
  train_id: number;
  train_number: string;
  train_name: string;
  type: string;
  total_coaches: number;
  coachDetails: CoachDetail[];
}

// (Helper functions here remain the same)
function getPrefix(coachType: string): string {
  switch (coachType) {
    case "AC First": return "ACF";
    case "AC Second": return "ACS";
    case "Sleeper": return "SLP";
    case "General": return "GEN";
    default: return "COACH";
  }
}

function getNextCoachNumber(coachDetails: CoachDetail[], coachType: string): string {
  const prefix = getPrefix(coachType);
  let max = 0;
  coachDetails.forEach(detail => {
    if (detail.coachType === coachType && detail.coachNumber) {
      const parts = detail.coachNumber.split("-");
      if (parts.length === 2) {
        const num = parseInt(parts[1]);
        if (num > max) { max = num; }
      }
    }
  });
  return `${prefix}-${max + 1}`;
}

export default function EditTrain() {
  const router = useRouter();
  const { train_id } = router.query;

  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [type, setType] = useState("");
  const [coachDetails, setCoachDetails] = useState<CoachDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!train_id) return;
    async function fetchTrain() {
      setLoading(true);
      try {
        const res = await fetch(`/api/deltrain/get?train_id=${train_id}`);
        if (!res.ok) throw new Error("Failed to fetch train details");
        const data: TrainData = await res.json();
        setTrainNumber(data.train_number);
        setTrainName(data.train_name);
        setType(data.type);
        setCoachDetails(data.coachDetails ?? []);
      } catch (error: any) {
        setMessage(error.message || "Error fetching train details");
      } finally {
        setLoading(false);
      }
    }
    fetchTrain();
  }, [train_id]);

  // When changing coach type, update coachNumber if needed.
  const handleCoachTypeChange = (index: number, newType: string) => {
    const updated = [...coachDetails];
    updated[index].coachType = newType;
    if (!updated[index].coachNumber) {
      updated[index].coachNumber = getNextCoachNumber(updated, newType);
    }
    setCoachDetails(updated);
  };

  const handleCoachCapacityChange = (index: number, value: string) => {
    const updated = [...coachDetails];
    updated[index].capacity = value;
    setCoachDetails(updated);
  };

  const addCoachDetail = () => {
    setCoachDetails([
      ...coachDetails,
      { coachType: "", capacity: "" } // New row does not have a coach_id.
    ]);
  };

  const removeCoachDetail = (index: number) => {
    const updated = [...coachDetails];
    updated.splice(index, 1);
    setCoachDetails(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!trainNumber || !trainName || !type) {
      setMessage("Please fill all train fields");
      return;
    }
    for (const detail of coachDetails) {
      if (!detail.coachType || !detail.capacity || !detail.coachNumber) {
        setMessage("Please complete all fields in coach details");
        return;
      }
    }
    try {
      const res = await fetch("/api/deltrain/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          train_id,
          trainNo: trainNumber,
          trainName,
          type,
          coachDetails, // This payload now includes coach_id for existing records.
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to update train");
      } else {
        setMessage("Train updated successfully!");
        setTimeout(() => {
          router.push("/admin/trainop/remove");
        }, 1500);
      }
    } catch (error: any) {
      setMessage("Error updating train");
    }
  }

  return (
    <>
      <Head>
        <title>Edit Train</title>
      </Head>
      <div className="min-h-screen bg-[#ECF0F1] flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-[#2C3E50] mb-6 text-center">
            Edit Train 🚆
          </h1>
          {loading ? (
            <p className="text-[#95A5A6]">Loading train details...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Train Number */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                  Train Number
                </label>
                <input
                  type="text"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 text-black"
                />
              </div>
              {/* Train Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                  Train Name
                </label>
                <input
                  type="text"
                  value={trainName}
                  onChange={(e) => setTrainName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 text-black"
                />
              </div>
              {/* Type */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                  Type of Train
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 text-black"
                >
                  <option value="" disabled hidden>
                    Select Train Type
                  </option>
                  <option value="EXP">Express</option>
                  <option value="PAS">Passenger</option>
                  <option value="SUP">Superfast</option>
                  <option value="LOC">Local</option>
                  <option value="MAIL">Mail</option>
                </select>
              </div>
              {/* Coach Details Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                  Coach Details:
                </label>
                {coachDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col mb-4 border p-2 rounded">
                    <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                      Coach Number:{" "}
                      <span className="text-xs text-gray-600">
                        {detail.coachNumber ? detail.coachNumber : "(ex: ACF-1)"}
                      </span>
                    </label>
                    <select
                      value={detail.coachType}
                      onChange={(e) => handleCoachTypeChange(index, e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    >
                      <option value="" disabled>
                        Select Coach Type
                      </option>
                      <option value="AC First">AC First</option>
                      <option value="AC Second">AC Second</option>
                      <option value="Sleeper">Sleeper</option>
                      <option value="General">General</option>
                    </select>
                    <div className="mb-2">
                      <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
                        Capacity per Coach
                      </label>
                      <input
                        type="number"
                        value={detail.capacity}
                        onChange={(e) => handleCoachCapacityChange(index, e.target.value)}
                        required
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded text-black"
                      />
                    </div>
                    {coachDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCoachDetail(index)}
                        className="mt-2 text-sm text-red-500 self-end"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCoachDetail}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 font-bold text-white rounded"
                >
                  Add Coach
                </button>
              </div>
              {message && <p className="mb-4 text-center text-red-600">{message}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#F39C12] hover:bg-[#e08e0b] text-white font-bold transition duration-200"
              >
                Update Train
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

