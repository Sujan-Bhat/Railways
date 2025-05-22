"use client";

import { useState } from "react";
import Head from "next/head";

const railwayStaff = [
  { name: "Ravi Sharma", designation: "Station Master", phone: "9876543210", email: "ravi@railways.in" },
  { name: "Anita Mehra", designation: "Ticket Examiner", phone: "9123456780", email: "anita@railways.in" },
  { name: "Rajesh Kumar", designation: "Train Conductor", phone: "9345678901", email: "rajesh@railways.in" },
  { name: "Pooja Verma", designation: "Reservation Clerk", phone: "9988776655", email: "pooja@railways.in" },
  { name: "Deepak Singh", designation: "Enquiry Officer", phone: "9876123450", email: "deepak@railways.in" },
  { name: "Kavita Joshi", designation: "Signal Maintainer", phone: "8765432190", email: "kavita@railways.in" },
  { name: "Manoj Yadav", designation: "Platform Manager", phone: "8899776655", email: "manoj@railways.in" },
  { name: "Nikita Rao", designation: "Safety Inspector", phone: "9090909090", email: "nikita@railways.in" },
  { name: "Sunil Dube", designation: "Luggage Attendant", phone: "9191919191", email: "sunil@railways.in" },
  { name: "Neha Bansal", designation: "Cleaning Supervisor", phone: "9292929292", email: "neha@railways.in" },
];

export default function ContactPage() {
  const [complainName, setComplainName] = useState("");
  const [complainPhone, setComplainPhone] = useState("");
  const [complainEmail, setComplainEmail] = useState("");
  const [referTo, setReferTo] = useState("");
  const [complainMessage, setComplainMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Complaint Submitted!`);
    setComplainName("");
    setComplainPhone("");
    setComplainEmail("");
    setReferTo("");
    setComplainMessage("");
  };

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>

      <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800">Railway Help & Contacts</h1>

          {/* Staff Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Meet Our Railway Staff</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {railwayStaff.map((person, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.designation}</p>
                  <p className="text-sm text-gray-600">📞 {person.phone}</p>
                  <p className="text-sm text-gray-600">✉️ {person.email}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Complaint Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lodge a Complaint</h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
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
              <div>
                <label className="block font-medium mb-1">Refer Complaint To</label>
                <input
                  type="text"
                  value={referTo}
                  onChange={(e) => setReferTo(e.target.value)}
                  list="staffList"
                  required
                  placeholder="Choose staff member"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <datalist id="staffList">
                  {railwayStaff.map((person) => (
                    <option key={person.name} value={person.name} />
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
              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
              >
                Submit Complaint
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}