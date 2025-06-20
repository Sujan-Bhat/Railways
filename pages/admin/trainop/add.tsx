import Head from "next/head";
import { useState } from "react";

export default function AddTrain() {
  // Train related states
  const [trainNo, setTrainNo] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainType, setTrainType] = useState("");
  // Instead of a single input, we use an array to hold coach details.
  const [coachDetails, setCoachDetails] = useState([
    { coachType: "", quantity: "", capacity: "" },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Options for train names (for suggestions)
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

  // Functions to manage dynamic coach details

  // Update a specific coach detail field
  const handleCoachDetailChange = (
    index: number,
    field: "coachType" | "quantity" | "capacity",
    value: string
  ) => {
    const updated = [...coachDetails];
    updated[index] = { ...updated[index], [field]: value };
    setCoachDetails(updated);
  };

  // Add a new empty coach detail row
  const addCoachDetail = () => {
    setCoachDetails([
      ...coachDetails,
      { coachType: "", quantity: "", capacity: "" },
    ]);
  };

  // Remove an existing coach detail row
  const removeCoachDetail = (index: number) => {
    const updated = [...coachDetails];
    updated.splice(index, 1);
    setCoachDetails(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate train-related fields
    if (!trainNo || !trainName || !trainType) {
      setErrorMessage("Please fill all train fields");
      return;
    }

    // Validate each coach detail row
    if (coachDetails.length === 0) {
      setErrorMessage("Please add at least one coach detail");
      return;
    }
    for (let i = 0; i < coachDetails.length; i++) {
      const { coachType, quantity, capacity } = coachDetails[i];
      if (!coachType || !quantity || !capacity) {
        setErrorMessage("Please fill all fields in coach details");
        return;
      }
      if (Number(quantity) < 1 || Number(capacity) < 1) {
        setErrorMessage("Quantity and capacity must be at least 1");
        return;
      }
    }

    setLoading(true);

    try {
      // Submit the form data to your API endpoint.
      const response = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNo,
          trainName,
          trainType,
          coachDetails, // Send the array of coach details along with train info
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong");
      } else {
        setSuccessMessage("Train added successfully!");
        // Clear all form fields once submission succeeds
        setTrainNo("");
        setTrainName("");
        setTrainType("");
        setCoachDetails([{ coachType: "", quantity: "", capacity: "" }]);
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

 <div className="min-h-screen bg-[#ECF0F1] py-10 px-4 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md md:max-w-lg lg:max-w-xl animate-fadeIn">
          <h2 className="text-center text-black mb-6 text-3xl font-bold animate-slideInDown">
            Add New Train 🚆
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-600 font-semibold">
              {errorMessage}
            </div>
          )}

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
                className="w-full px-4 py-3 border border-[#95A5A6] rounded-xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#F39C12] bg-white"
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
                autoComplete="new-password" // Use a non-standard value to prevent unwanted browser autofill
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
                      className="px-4 py-2 text-[#2C3E50] hover:bg-[#ECF0F1] cursor-pointer transition"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Train Type Dropdown */}
            <div className="mb-4 relative">
              <label className="block text-sm font-semibold text-black mb-1">
                Train Type
              </label>
              <select
                value={trainType}
                onChange={(e) => setTrainType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#95A5A6] rounded-xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#F39C12] bg-white appearance-none"
              >
                <option value="" disabled hidden>
                  Select Train Type
                </option>
                <option value="EXP">Express Train</option>
                <option value="PAS">Passenger</option>
                <option value="SUP">Superfast</option>
                <option value="LOC">Local</option>
                <option value="MAIL">Mail</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg
                  className="fill-current h-4 w-4 text-[#2C3E50]"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548L10 12.032l4.484-4.484a1 1 0 011.414 1.414l-5.191 5.19a1 1 0 01-1.414 0L4.102 8.962A1 1 0 015.516 7.548z" />
                </svg>
              </div>
            </div>

            {/* Coach Details Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-1">
                Coach Details
              </label>
              {coachDetails.map((detail, index) => ( 
                <div
                  key={index}
                  className="flex flex-col mb-4 border p-2 rounded"
                >
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-black mb-1">
                      Coach Type
                    </label>
                    <select
                      value={detail.coachType}
                      onChange={(e) =>
                        handleCoachDetailChange(
                          index,
                          "coachType",
                          e.target.value
                        )
                      }
                      required
                      className="w-full p-2 border border-gray-300 rounded bg-white text-black"

                    >
                      <option value="" disabled>
                        Select Coach Type
                      </option>
                      <option value="AC First">AC First</option>
                      <option value="AC Second">AC Second</option>
                      <option value="Sleeper">Sleeper</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-black mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={detail.quantity}
                      onChange={(e) =>
                        handleCoachDetailChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      required
                      min="1"
                      className="w-full p-2 border border-[#95A5A6] rounded-xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#F39C12] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1">
                      Capacity per Coach
                    </label>
                    <input
                      type="number"
                      value={detail.capacity}
                      onChange={(e) =>
                        handleCoachDetailChange(
                          index,
                          "capacity",
                          e.target.value
                        )
                      }
                      required
                      min="1"
                      className="w-full p-2 border border-[#95A5A6] rounded-xl text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#F39C12] bg-white"
                    />
                  </div>
                  {coachDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCoachDetail(index)}
                      className="mt-2 text-sm text-[#E74C3C] hover:text-[#C0392B] self-end transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
              }
              <button
                type="button"
                onClick={addCoachDetail}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 font-bold text-white rounded"
              >
                Add Coach
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-[#F39C12] hover:bg-[#E08E0B] text-white font-bold transition duration-200 ${
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


