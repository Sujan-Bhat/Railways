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
    return stationList.filter(
      (station) =>
        station.toLowerCase().includes(input.toLowerCase()) &&
        station !== exclude
    ).slice(0, 10);
  };

  // Validation: all fields must be filled AND fromStation !== toStation
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

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-red-500">Book Your Ticket</h1>

        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">From Station</label>
          <input
            type="text"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter from station"
            list="fromStations"
          />
          <datalist id="fromStations">
            {filterStations(fromStation, toStation).map((station) => (
              <option key={station} value={station} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block font-medium mb-1">To Station</label>
          <input
            type="text"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter to station"
            list="toStations"
          />
          <datalist id="toStations">
            {filterStations(toStation, fromStation).map((station) => (
              <option key={station} value={station} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block font-medium mb-1">Amount to be Paid</label>
          <div className="w-full border rounded px-3 py-2 bg-gray-100">
            {amount}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            disabled={!isFormValid}
            className={`px-4 py-2 rounded text-white ${
              isFormValid
                ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>

          {/* Link wrapped Reserve button */}
          {isFormValid ? (
            <Link
              href={{
                pathname: "/reserve",
                query: {
                  from: fromStation,
                  to: toStation,
                  amount: amount,
                },
              }}
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Reserve
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </>
  );
}
