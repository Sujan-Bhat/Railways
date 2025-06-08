"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

interface Station {
  station_id: number;
  station_name: string;
}

interface Train {
  train_id: number;
  train_name: string;
}

export default function BookTicket() {
  const router = useRouter();
  const [trains, setTrains] = useState<Train[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [formData, setFormData] = useState({
    // When integrated with auth, user_id is fetched on the backend.
    train_id: "",
    from_station_id: "",
    to_station_id: "",
    journey_date: "",
    status: "Confirmed", // default status
  });
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch stations and trains when the component mounts.
  useEffect(() => {
    fetchStations();
    fetchTrains();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await fetch("/api/stations/getAll");
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data.stations);
    } catch (err: any) {
      setError(err.message || "Error fetching stations");
    }
  };

  const fetchTrains = async () => {
    try {
      const res = await fetch("/api/deltrain");
      if (!res.ok) throw new Error("Failed to fetch trains");
      const data = await res.json();
      setTrains(data.trains);
    } catch (err: any) {
      setError(err.message || "Error fetching trains");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBookingSuccess("");

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The formData already includes "status": "Confirmed"
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to book ticket");

      setBookingSuccess(`Booking Successful! Your Booking ID is ${data.booking_id}`);
      // Redirect to home page after 2 seconds.
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Error processing booking");
    }
  };

  return (
    <>
      <Head>
        <title>Book Train Ticket</title>
      </Head>
      <div className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
        <div className="max-w-5xl w-full bg-white border border-red-500 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Book Train Ticket</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {bookingSuccess && <p className="text-red-500 text-center mb-4">{bookingSuccess}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Train</label>
              <select
                name="train_id"
                value={formData.train_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                required
              >
                <option value="">Select Train</option>
                {trains.map((train) => (
                  <option key={train.train_id} value={train.train_id}>
                    {train.train_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">From Station</label>
              <select
                name="from_station_id"
                value={formData.from_station_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                required
              >
                <option value="">Select Source Station</option>
                {stations.map((station) => (
                  <option key={station.station_id} value={station.station_id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">To Station</label>
              <select
                name="to_station_id"
                value={formData.to_station_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                required
              >
                <option value="">Select Destination Station</option>
                {stations.map((station) => (
                  <option key={station.station_id} value={station.station_id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Journey Date</label>
              <input
                type="date"
                name="journey_date"
                value={formData.journey_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                required
              />
            </div>

            {/* A hidden input ensures that "status" is sent; note that the state also provides this. */}
            <input type="hidden" name="status" value="Confirmed" />

            <button
              type="submit"
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded"
            >
              Book Ticket
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

