import Head from "next/head";
import { useState } from "react";

export default function AddTrain() {
  const [trainNo, setTrainNo] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainType, setTrainType] = useState("");
  const [coaches, setCoaches] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state for messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const trainNameOptions = [
    "Shatabdi Express", "Rajdhani Express", "Duronto Express", "Garib Rath",
    "Vande Bharat Express", "Tejas Express", "Gatiman Express", "Humsafar Express",
    "Intercity Express", "Jan Shatabdi", "Superfast Express", "Mail Express",
    "Passenger", "Antyodaya Express", "Uday Express", "Sampark Kranti",
    "Double Decker", "Kavi Guru Express", "Yuva Express", "Swarna Shatabdi"
  ];

  const filteredTrainNames = trainNameOptions.filter(name =>
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

      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white flex flex-col items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Train 🚆</h2>

          {/* Show error message */}
          {errorMessage && (
            <div className="mb-4 text-red-600 font-semibold">{errorMessage}</div>
          )}

          {/* Show success message */}
          {successMessage && (
            <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
          )}

          {/* Train Number */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Train Number</label>
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Train Name with suggestions */}
          <div className="mb-4 relative">
            <label className="block text-gray-600 font-medium mb-1">Train Name</label>
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
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
            />
            {showSuggestions && trainName && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-xl shadow max-h-40 overflow-auto">
                {filteredTrainNames.map((name) => (
                  <li
                    key={name}
                    onMouseDown={() => {
                      setTrainName(name);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Train Type */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Train Type</label>
            <select
              value={trainType}
              onChange={(e) => setTrainType(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
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

          {/* Total Coaches */}
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-1">Total Coaches</label>
            <input
              type="number"
              value={coaches}
              onChange={(e) => setCoaches(e.target.value)}
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Adding..." : "Add Train"}
          </button>
        </form>
      </div>
    </>
  );
}