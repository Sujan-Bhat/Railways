"use client";

import { useState } from "react";
import Head from "next/head";

const railwayStaff = [
  { name: "Ajay Singh", designation: "Station Master" },
  { name: "Neha Sharma", designation: "Ticket Inspector" },
  { name: "Ravi Kumar", designation: "Train Controller" },
  { name: "Sunita Patel", designation: "Customer Support" },
  { name: "Anil Verma", designation: "Operations Manager" },
  { name: "Priya Gupta", designation: "Safety Officer" },
  { name: "Vikram Joshi", designation: "Maintenance Head" },
  { name: "Kavita Rao", designation: "Reservation Officer" },
  { name: "Suresh Iyer", designation: "Public Relations" },
  { name: "Deepa Nair", designation: "Complaint Handler" },
];

export default function ContactPage() {
  const [complainName, setComplainName] = useState("");
  const [complainPhone, setComplainPhone] = useState("");
  const [complainEmail, setComplainEmail] = useState("");
  const [referTo, setReferTo] = useState("");
  const [complainMessage, setComplainMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Function to submit the complaint data to the API route ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // <-- LINK: Posting complaint data to Next.js API endpoint -->
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: complainName,
          phone: complainPhone,
          email: complainEmail,
          referTo,            // <-- Selected staff member from the datalist
          message: complainMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess("Complaint submitted successfully!");

      // Reset form fields after successful submission
      setComplainName("");
      setComplainPhone("");
      setComplainEmail("");
      setReferTo("");
      setComplainMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>

      <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800">
            Railway Help & Contacts
          </h1>

          {/* --- Display railway personnel list --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Railway Personnel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* <-- LINK: Mapping railwayStaff array to show staff and designation --> */}
              {railwayStaff.map(({ name, designation }) => (
                <div
                  key={name}
                  className="p-4 bg-white rounded-lg shadow flex flex-col"
                >
                  <div className="text-lg font-bold text-red-500">{name}</div>
                  <div className="text-gray-600">{designation}</div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Complaint Form Section --- */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Lodge a Complaint
            </h2>
            <form
              onSubmit={handleSubmit}  // <-- LINK: form submit triggers handleSubmit -->
              className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
              {/* Form inputs bound to React state */}
              <input
                type="text"
                placeholder="Your Name"
                value={complainName}
                onChange={(e) => setComplainName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="tel"
                placeholder="Your Phone"
                value={complainPhone}
                onChange={(e) => setComplainPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={complainEmail}
                onChange={(e) => setComplainEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Refer complaint to input with datalist to select railway staff */}
              <div>
                <label className="block font-medium mb-1">
                  Refer Complaint To
                </label>
                <input
                  type="text"
                  value={referTo}
                  onChange={(e) => setReferTo(e.target.value)}
                  list="staffList"
                  required
                  placeholder="Choose staff member"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {/* <-- LINK: datalist options populated from railwayStaff names --> */}
                <datalist id="staffList">
                  {railwayStaff.map(({ name }) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-medium mb-1">Complaint Message</label>
                <textarea
                  value={complainMessage}
                  onChange={(e) => setComplainMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue here..."
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Error and success message display */}
              {error && (
                <p className="text-red-600 font-semibold">{error}</p>
              )}
              {success && (
                <p className="text-green-600 font-semibold">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}