"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Updated import from next/navigation
import { useEffect, useState } from "react";
import Head from "next/head";

interface UserDetails {
  name: string;
  email: string;
  gender: string;
}

interface Booking {
  booking_id: number;
  journey_date: string;
  seat_number: string;
}

export default function Details() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/users/details");
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUserDetails(data.user);
      } catch (err: any) {
        setError(err.message || "Error fetching user details");
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/mine");
        if (!res.ok) throw new Error("Failed to fetch booking details");
        const data = await res.json();
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.message || "Error fetching booking details");
      }
    };

    fetchUserDetails();
    fetchBookings();
  }, [session, status, router]);

  return (
    <>
      <Head>
        <title>User & Booking Details</title>
      </Head>
      <div className="min-h-screen bg-white p-6 text-black">
        <h1 className="text-3xl font-bold mb-4">User Details</h1>
        {error && <p className="text-red-500">{error}</p>}
        {userDetails ? (
          <div className="mb-8">
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Gender:</strong> {userDetails.gender}
            </p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
        {bookings.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Booking ID</th>
                <th className="border p-2">Journey Date</th>
                <th className="border p-2">Seat Number</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id} className="hover:bg-gray-100">
                  <td className="border p-2">{booking.booking_id}</td>
                  <td className="border p-2">{booking.journey_date}</td>
                  <td className="border p-2">
                    {booking.seat_number ? booking.seat_number : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings are made.</p>
        )}
      </div>
    </>
  );
}

