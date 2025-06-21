"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../src/app/layout/header";
import Footer from "../src/app/layout/footer";
import { useSession } from "next-auth/react";

type Station = {
  station_id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
};

type Train = {
  train_id: number;
  train_number: string;
  train_name: string;
  type: string;
};

type Coach = {
  coach_id: number;
  coach_type: string;
  coach_number: string;
  capacity: number;
};

type Passenger = {
  passenger_name: string;
  age: number | "";
  gender: string;
};

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // State declarations
  const [stations, setStations] = useState<Station[]>([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [coachOptions, setCoachOptions] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [passengers, setPassengers] = useState<Passenger[]>([
    { passenger_name: "", age: "", gender: "" },
  ]);
  const [farePreview, setFarePreview] = useState<number | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");

  // Fetch station data on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/bookings/getStations");
        if (res.ok) {
          const data = await res.json();
          setStations(data);
        } else {
          console.error("Failed to fetch stations:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    fetchStations();
  }, []);

  // Update fare preview when key selections change.
  useEffect(() => {
    if (
      selectedTrain &&
      selectedCoach &&
      fromStation &&
      toStation &&
      journeyDate &&
      passengers.length > 0
    ) {
      const payload = {
        train_id: selectedTrain.train_id,
        from_station_id: fromStation,
        to_station_id: toStation,
        coach_id: selectedCoach,
        passengers: passengers,
      };

      fetch("/api/bookings/calculateFare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFarePreview(data.fare);
          } else {
            console.error("Error calculating fare:", data.error);
            setFarePreview(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching fare preview:", err);
          setFarePreview(null);
        });
    }
  }, [selectedTrain, selectedCoach, fromStation, toStation, journeyDate, passengers]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/bookings/searchTrains?fromStation=${fromStation}&toStation=${toStation}`
      );
      if (res.ok) {
        const trains = await res.json();
        setSearchResults(trains);
      } else {
        console.error("Error searching trains:", await res.text());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSelectTrain = async (train: Train) => {
    setSelectedTrain(train);
    try {
      const res = await fetch(`/api/bookings/getCoaches?trainId=${train.train_id}`);
      if (res.ok) {
        const coaches = await res.json();
        setCoachOptions(coaches);
      } else {
        console.error("Error fetching coaches:", await res.text());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index][field] = field === "age" ? (value === "" ? "" : Number(value)) : value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { passenger_name: "", age: "", gender: "" }]);
  };

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      train_id: selectedTrain?.train_id,
      journey_date: journeyDate,
      from_station_id: fromStation,
      to_station_id: toStation,
      coach_id: selectedCoach,
      passengers,
    };

    try {
      const res = await fetch("/api/bookings/bookTickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBookingMessage("Booking successful! Your booking ID is " + data.booking_id);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        setBookingMessage("Booking failed. " + data.error);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingMessage("Booking error occurred.");
    }
  };

  return (
    <>
      <Head>
        <title>Railway Ticket Booking</title>
      </Head>
      <Header />
      <div className="min-h-screen bg-[#ECF0F1] p-6 flex flex-col items-center text-[#2C3E50]">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Railway Ticket Booking</h1>
          
          {/* Step 1: Train Search Form */}
          <form onSubmit={handleSearch} className="w-full mb-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
              <div className="flex-1">
                <label className="block mb-2 font-semibold">From Station:</label>
                <select
                  value={fromStation}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFromStation(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="">--Select Station--</option>
                  {stations.map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name} ({station.station_code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-semibold">To Station:</label>
                <select
                  value={toStation}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setToStation(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="">--Select Station--</option>
                  {stations.map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name} ({station.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Journey Date:</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Search Trains
            </button>
          </form>

          {hasSearched && searchResults.length === 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">No Trains Scheduled</h2>
              <p className="mb-2">
                We're sorry, but there are no trains scheduled for the selected route on {journeyDate}.
              </p>
              <p className="mb-2">Consider alternative options.</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Available Trains</h2>
              <ul>
{searchResults.map((train) => (
  <li
    key={train.train_id}
    className={`flex items-center justify-between border p-4 rounded-md mb-2 transition 
      ${selectedTrain?.train_id === train.train_id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
  >
    <span>
      <strong>{train.train_number} - {train.train_name}</strong> ({train.type})
    </span>
    <button
      onClick={() => handleSelectTrain(train)}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
    >
      {selectedTrain?.train_id === train.train_id ? 'Selected' : 'Select'}
    </button>
  </li>
))}
             </ul>
            </div>
          )}

          {selectedTrain && coachOptions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Select Coach Type</h2>
              <select
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
              >
                <option value="">--Select Coach--</option>
                {coachOptions.map((coach) => (
                  <option key={coach.coach_id} value={coach.coach_id}>
                    {coach.coach_type} (Coach No: {coach.coach_number})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCoach && (
            <form onSubmit={handleBooking} className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
              {passengers.map((p, index) => (
                <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Name:</label>
                    <input
                      type="text"
                      value={p.passenger_name}
                      onChange={(e) => updatePassenger(index, "passenger_name", e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Age:</label>
                    <input
                      type="number"
                      value={p.age}
                      onChange={(e) => updatePassenger(index, "age", e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Gender:</label>
                    <input
                      type="text"
                      value={p.gender}
                      onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              ))}
              
              {/* Fare Preview Display */}
              {farePreview !== null ? (
                <div className="mb-4 text-center font-semibold text-xl">
                  Estimated Fare: Rs. {farePreview.toFixed(2)}
                </div>
              ) : (
                <div className="mb-4 text-center font-semibold text-xl">
                  Calculating fare...
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={addPassenger}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                  Add Another Passenger
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Confirm Booking
              </button>
            </form>
          )}
          {bookingMessage && (
            <p className="mt-4 text-center font-semibold">{bookingMessage}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

