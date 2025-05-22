"use client";

import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function ReservePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const amount = searchParams.get("amount") || "₹0.00";

  return (
    <>
      <Head>
        <title>Reservation Ticket</title>
      </Head>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4 border border-gray-300">
        <h2 className="text-xl font-bold text-center text-red-500">Your Ticket</h2>

        <div className="text-gray-800 space-y-1">
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Amount:</strong> {amount}</p>
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Pay Now
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Pay Cash Later
          </button>
        </div>
      </div>
    </>
  );
}
