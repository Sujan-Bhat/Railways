import Head from "next/head";
import { useState } from "react";

export default function AddTrain() {
  const [trainNo, setTrainNo] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainType, setTrainType] = useState("");
  const [coaches, setCoaches] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const trainNameOptions = [
    "Shatabdi Express",
    "Rajdhani Express",
    "Duronto Express",
    "Garib Rath",
    "Vande Bharat Express",
    "Tejas Express",
    "Gatiman Express",
    "Humsafar Express",
    "Intercity Express",
    "Jan Shatabdi",
    "Superfast Express",
    "Mail Express",
    "Passenger",
    "Antyodaya Express",
    "Uday Express",
    "Sampark Kranti",
    "Double Decker",
    "Kavi Guru Express",
    "Yuva Express",
    "Swarna Shatabdi",
  ];

  const filteredTrainNames = trainNameOptions.filter((name) =>
    name.toLowerCase().includes(trainName.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!trainNo || !trainName || !trainType || !coaches) {
      setErrorMessage("Please fill all fields");
      return;
    }

    if (Number(coaches) < 0) {
      setErrorMessage("Total coaches cannot be negative");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNo,
          trainName,
          trainType,
          coaches,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong");
      } else {
        setSuccessMessage("Train added successfully!");
        setTrainNo("");
        setTrainName("");
        setTrainType("");
        setCoaches("");
      }
    } catch (error) {
      setErrorMessage("Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Add Train</title>
      </Head>

      {/* Outer container */}
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-[500px] animate-fadeIn">
          <h2 className="text-center text-black mb-6 text-3xl font-bold animate-slideInDown">
            Add New Train 🚆
          </h2>

          {/* Display error message */}
          {errorMessage && (
            <div className="mb-4 text-red-600 font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div className="mb-4 text-green-600 font-semibold">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Train Number */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-1">
                Train Number
              </label>
              <input
                type="text"
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            {/* Train Name with suggestions */}
            <div className="mb-4 relative">
              <label className="block text-sm font-semibold text-black mb-1">
                Train Name
              </label>
              <input
                type="text"
                value={trainName}
                onChange={(e) => {
                  setTrainName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                required
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white"
              />
              {showSuggestions && trainName && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-xl shadow max-h-40 overflow-auto text-black">
                  {filteredTrainNames.map((name) => (
                    <li
                      key={name}
                      onMouseDown={() => {
                        setTrainName(name);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Train Type Dropdown*/}
            <div className="mb-4 relative">
              <label className="block text-sm font-semibold text-black mb-1">
                Train Type
              </label>
              <select
                value={trainType}
                onChange={(e) => setTrainType(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white appearance-none"
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
              {/* Custom arrow icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg
                  className="fill-current h-4 w-4"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548L10 12.032l4.484-4.484a1 1 0 011.414 1.414l-5.191 5.19a1 1 0 01-1.414 0L4.102 8.962A1 1 0 015.516 7.548z"/>
                </svg>
              </div>
            </div>

            {/* Total Coaches */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-1">
                Total Coaches
              </label>
              <input
                type="number"
                value={coaches}
                onChange={(e) => setCoaches(e.target.value)}
                min="0"
                required
                className="w-full p-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add Train"}
            </button>
          </form>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-in-out;
        }
      `}</style>
    </>
  );
}


