"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

interface PassengerDetail {
  passenger_id: number;
  passenger_name: string;
  age: number | null;
  gender: string | null;
  seat_number: string | null;
  created_at: string;
  train_name: string;
  from_station: string;
  to_station: string;
}

export default function ViewPassengerDetails() {
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPassengerDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/passengers/view");
        if (!res.ok) {
          throw new Error("Failed to fetch passenger details");
        }
        const data = await res.json();
        setPassengers(data.passengers);
      } catch (err: any) {
        setError(err.message || "Error fetching passenger details");
      } finally {
        setLoading(false);
      }
    };

    fetchPassengerDetails();
  }, []);

  return (
    <>
      <Head>
        <title>Passenger Details</title>
      </Head>
      <div className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
        {/* Card container with red accent border */}
        <div className="max-w-5xl w-full bg-white border border-red-500 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Passenger Details</h1>

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {(!loading && passengers.length === 0) && (
            <p className="text-center">No passenger data available.</p>
          )}

          {passengers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Passenger ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Age</th>
                    <th className="border p-2">Gender</th>
                    <th className="border p-2">Seat Number</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Train</th>
                    <th className="border p-2">From-Sation</th>
                    <th className="border p-2">To-Staion</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((p) => (
                    <tr key={p.passenger_id} className="border-b hover:bg-gray-50">
                      <td className="border p-2">{p.passenger_id}</td>
                      <td className="border p-2">{p.passenger_name}</td>
                      <td className="border p-2">{p.age ?? "-"}</td>
                      <td className="border p-2">{p.gender ?? "-"}</td>
                      <td className="border p-2">{p.seat_number ?? "-"}</td>
                      <td className="border p-2">{p.created_at}</td>
                      <td className="border p-2">{p.train_name}</td>
                      <td className="border p-2">{p.from_station}</td>
                      <td className="border p-2">{p.to_station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

