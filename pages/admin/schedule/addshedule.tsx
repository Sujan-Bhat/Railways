"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function AddSchedule() {
  const [startingStop, setStartingStop] = useState("");
  const [train, setTrain] = useState("");
  const [stops, setStops] = useState([
    { name: "", arrival: "", departure: "", day: "" },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddStop = () => {
    setStops([...stops, { name: "", arrival: "", departure: "", day: "" }]);
  };

  const handleStopChange = (index: number, field: string, value: string) => {
    const newStops = [...stops];
    newStops[index][field as keyof typeof newStops[0]] = value;
    setStops(newStops);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation & submission logic here
    alert("Schedule submitted!");
  };

  return (
    <>
      <Head>
        <title>Add Schedule</title>
      </Head>

      <div
        className={`
          min-h-screen bg-white flex items-center justify-center px-4 py-10
          transform transition-all duration-700 ease-in-out
          ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
        `}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl border border-gray-200 rounded-2xl p-10 w-full max-w-3xl text-black space-y-6"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-black text-center">
            Add Schedule
          </h1>

          {/* Starting Stop */}
          <input
            type="text"
            placeholder="Starting Stop"
            value={startingStop}
            onChange={(e) => setStartingStop(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
          />

          {/* Train */}
          <input
            type="text"
            placeholder="Train Name / Number"
            value={train}
            onChange={(e) => setTrain(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
          />

          {/* Dynamic Stops */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Stops</h2>
            {stops.map((stop, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center"
              >
                <input
                  type="text"
                  placeholder="Stop Name"
                  value={stop.name}
                  onChange={(e) => handleStopChange(idx, "name", e.target.value)}
                  required
                  className="px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                <input
                  type="time"
                  placeholder="Arrival Time"
                  value={stop.arrival}
                  onChange={(e) => handleStopChange(idx, "arrival", e.target.value)}
                  className="px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                <input
                  type="time"
                  placeholder="Departure Time"
                  value={stop.departure}
                  onChange={(e) =>
                    handleStopChange(idx, "departure", e.target.value)
                  }
                  className="px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Journey Day"
                  value={stop.day}
                  onChange={(e) => handleStopChange(idx, "day", e.target.value)}
                  className="px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddStop}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition"
            >
              Add Stop
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition"
          >
            Submit Schedule
          </button>
        </form>
      </div>
    </>
  );
}
