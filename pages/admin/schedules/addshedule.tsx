"use client";

import { useState } from "react";

type Stop = {
  stationId: string;
  stopSequence: number;
  arrivalDatetime: string;    // ISO datetime string
  departureDatetime: string;  // ISO datetime string
};

export default function AddTrainSchedule() {
  const [trainId, setTrainId] = useState("");
  const [stops, setStops] = useState<Stop[]>([
    { stationId: "", stopSequence: 1, arrivalDatetime: "", departureDatetime: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddStop = () => {
    setStops((prev) => [
      ...prev,
      {
        stationId: "",
        stopSequence: prev.length + 1,
        arrivalDatetime: "",
        departureDatetime: "",
      },
    ]);
  };

  const handleRemoveStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStopChange = (
    index: number,
    field: keyof Stop,
    value: string
  ) => {
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setStops(updatedStops);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!trainId.trim()) {
      setError("Train ID is required");
      return;
    }
    for (const stop of stops) {
      if (
        !stop.stationId.trim() ||
        !stop.arrivalDatetime.trim() ||
        !stop.departureDatetime.trim()
      ) {
        setError("All stop fields are required");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/train_schedules/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainId, stops }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add schedule");
      } else {
        setSuccess("Schedule added successfully!");
        setTrainId("");
        setStops([
          { stationId: "", stopSequence: 1, arrivalDatetime: "", departureDatetime: "" },
        ]);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white border border-orange-500 rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
          Add Train Schedule
        </h1>

        <div className="mb-4">
          <label className="block text-black font-semibold mb-2" htmlFor="trainId">
            Train ID
          </label>
          <input
            id="trainId"
            type="text"
            value={trainId}
            onChange={(e) => setTrainId(e.target.value)}
            className="w-full px-4 py-3 border border-black rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Train ID"
            required
          />
        </div>

        <h2 className="text-xl font-semibold text-black mb-4">Stops</h2>

        {stops.map((stop, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-md p-4 mb-4 relative"
          >
            {stops.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveStop(idx)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                aria-label="Remove stop"
              >
                &times;
              </button>
            )}

            <div className="mb-3">
              <label className="block text-black font-semibold mb-1">Station ID</label>
              <input
                type="text"
                value={stop.stationId}
                onChange={(e) => handleStopChange(idx, "stationId", e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter Station ID"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-black font-semibold mb-1">Stop Sequence</label>
              <input
                type="number"
                value={stop.stopSequence}
                readOnly
                className="w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100 text-black cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-semibold mb-1">Arrival Date & Time</label>
                <input
                  type="datetime-local"
                  value={stop.arrivalDatetime}
                  onChange={(e) =>
                    handleStopChange(idx, "arrivalDatetime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-black rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-1">Departure Date & Time</label>
                <input
                  type="datetime-local"
                  value={stop.departureDatetime}
                  onChange={(e) =>
                    handleStopChange(idx, "departureDatetime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-black rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleAddStop}
            className="bg-orange-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition"
          >
            + Add Stop
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
        {success && <p className="text-green-600 font-semibold mb-4">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md transition"
        >
          {loading ? "Adding Schedule..." : "Add Schedule"}
        </button>
      </form>
    </div>
  );
}
