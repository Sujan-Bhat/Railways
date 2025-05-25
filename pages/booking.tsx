"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const stationList = [
  "New Delhi", "Mumbai Central", "Chennai Central", "Howrah", "Secunderabad",
  "Bangalore City", "Ahmedabad", "Pune", "Kolkata", "Jaipur"
];

export default function BookingPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [amount, setAmount] = useState("₹250.00"); // Placeholder

  const filterStations = (input: string, exclude?: string) => {
    return stationList
      .filter(
        (station) =>
          station.toLowerCase().includes(input.toLowerCase()) &&
          station !== exclude
      )
      .slice(0, 10);
  };

  // Check if all fields are properly filled and the stations differ.
  const isFormValid =
    phone.trim() !== "" &&
    password.trim() !== "" &&
    fromStation.trim() !== "" &&
    toStation.trim() !== "" &&
    fromStation !== toStation;

  return (
    <>
      <Head>
        <title>Book Ticket</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-xl shadow-md w-[500px]">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Book Your Ticket
          </h1>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white mb-4"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white mb-4"
            />
          </div>

          {/* From Station Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              From Station
            </label>
            <input
              type="text"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              placeholder="Enter from station"
              list="fromStations"
              className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white mb-4"
            />
            <datalist id="fromStations">
              {filterStations(fromStation, toStation).map((station) => (
                <option key={station} value={station} />
              ))}
            </datalist>
          </div>

          {/* To Station Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              To Station
            </label>
            <input
              type="text"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              placeholder="Enter to station"
              list="toStations"
              className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white mb-4"
            />
            <datalist id="toStations">
              {filterStations(toStation, fromStation).map((station) => (
                <option key={station} value={station} />
              ))}
            </datalist>
          </div>

          {/* Amount Display */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Amount to be Paid
            </label>
            <div className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-black mb-4">
              {amount}
            </div>
          </div>

          {/* Reserve Button */}
          <div className="flex justify-center">
            {isFormValid ? (
              <Link
                href={{
                  pathname: "/reserve",
                  query: { from: fromStation, to: toStation, amount: amount },
                }}
              >
                <button className="w-full py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-black font-bold transition duration-200">
                  Reserve
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-gray-400 text-white font-bold transition duration-200 cursor-not-allowed"
              >
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

