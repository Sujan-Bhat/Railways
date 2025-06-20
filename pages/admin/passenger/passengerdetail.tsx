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
      {/* Main layout mimicking remove.tsx theme without header/footer */}
      <div className="min-h-screen bg-[#ECF0F1] p-6 flex flex-col items-center text-[#2C3E50]">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Passenger Details</h1>

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {(!loading && passengers.length === 0) && (
            <p className="text-center text-gray-500">No passenger data available.</p>
          )}

          {passengers.length > 0 && (
            <div className="overflow-x-auto rounded-md shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-[#ECF0F1]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Passenger ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Seat Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      Train
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      From Station
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b text-[#2C3E50]">
                      To Station
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passengers.map((p) => (
                    <tr key={p.passenger_id} className="hover:bg-gray-100">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.passenger_id}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.passenger_name}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.age ?? "-"}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.gender ?? "-"}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.seat_number ?? "-"}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.train_name}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.from_station}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{p.to_station}</td>
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

