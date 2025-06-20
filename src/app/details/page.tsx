"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../layout/header";
import Footer from "../layout/footer";

interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  aadhaar: string;
  created_at: string;
}

interface Passenger {
  passenger_id: number;
  passenger_name: string;
  age: number | null;
  gender: string | null;
  seat_number: string;
}

interface Booking {
  booking_id: number;
  journey_date: string;
  arrival_time: string | null;
  passengers: Passenger[];
}

export default function DetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const handleCancel = async (booking_id: number, passenger_id: number) => {
    if (!confirm("Are you sure you want to cancel this ticket?")) return;
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id, passenger_id }),
      });
      if (!res.ok) {
        throw new Error("Failed to cancel the booking.");
      }
      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          if (booking.booking_id === booking_id) {
            return {
              ...booking,
              passengers: booking.passengers.filter(
                (p) => p.passenger_id !== passenger_id
              ),
            };
          }
          return booking;
        })
      );
    } catch (err: any) {
      alert(err.message || "Error canceling the booking");
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const resUser = await fetch("/api/users/details");
        if (!resUser.ok) throw new Error("Failed to fetch user details");
        const userData = await resUser.json();
        setUserDetails(userData.user);

        const user_id = userData.user.id || session.user?.id;
        if (!user_id) {
          throw new Error("User ID not found.");
        }

        const resBookings = await fetch(`/api/bookings/mine?user_id=${user_id}`);
        if (!resBookings.ok)
          throw new Error("Failed to fetch booking details");
        const bookingData = await resBookings.json();
        setBookings(bookingData.bookings);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      }
    };

    fetchData();
  }, [session, status, router]);

  return (
    <>
      <Head>
        <title>User &amp; Booking Details</title>
      </Head>
      <Header />
      <main className="min-h-screen bg-[#ECF0F1] py-10 px-4 text-[#2C3E50]">
        <div className="container mx-auto">
          {error && (
            <p className="text-center text-red-500 mb-4">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Details Card */}
            <section className="bg-white shadow-xl rounded-lg p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-[#2C3E50]">
                  {userDetails ? userDetails.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-[#2C3E50] mb-4 text-center sm:text-left">
                    User Details
                  </h2>
                  {userDetails ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#2C3E50]">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Name:</span>
                        <span>{userDetails.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        <span>{userDetails.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Phone:</span>
                        <span>{userDetails.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Gender:</span>
                        <span>{userDetails.gender}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">DOB:</span>
                        <span>
                          {userDetails.dob
                            ? new Date(userDetails.dob).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="sm:col-span-2 flex items-center">
                        <span className="font-semibold mr-2">Address:</span>
                        <span>{userDetails.address}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Aadhaar:</span>
                        <span>{userDetails.aadhaar}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Registered On:</span>
                        <span>
                          {userDetails.created_at
                            ? new Date(userDetails.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center">Loading user details...</p>
                  )}
                </div>
              </div>
            </section>

            {/* Booking Details Card */}
            <section className="bg-white shadow-lg rounded-xl p-8">
              <h1 className="text-2xl font-bold border-b pb-2 mb-4 text-center">
                Booking Details
              </h1>
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking.booking_id}
                      className="border-l-4 border-blue-500 p-4 rounded-md bg-gray-50 hover:shadow-lg transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center"
                    >
                      <div className="mb-4 md:mb-0">
                        <p className="text-lg font-semibold">
                          Booking ID: <span className="font-normal">{booking.booking_id}</span>
                        </p>
                        <p className="text-gray-700">
                          Journey Date: <span className="font-medium">{booking.journey_date}</span>
                        </p>
                        <p className="text-gray-700">
                          Arrival Time:{" "}
                          <span className="font-medium">
                            {booking.arrival_time
                              ? new Date("1970-01-01T" + booking.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : "-"}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col w-full md:w-auto">
                        {booking.passengers.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg mb-2">Passenger Details:</h3>
                            <div className="grid grid-cols-1 gap-y-4">
                              {booking.passengers.map((p) => (
                                <div
                                  key={p.passenger_id}
                                  className="border p-3 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <p className="text-sm">
                                    <span className="font-semibold">ID:</span> {p.passenger_id}{" "}
                                    <span className="font-semibold ml-2">Name:</span> {p.passenger_name}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold">Age:</span> {p.age ?? "-"}{" "}
                                    <span className="font-semibold ml-2">Gender:</span> {p.gender ?? "-"}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold">Seat:</span> {p.seat_number || "-"}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleCancel(booking.booking_id, p.passenger_id)
                                    }
                                    className="mt-2 w-full md:w-auto px-3 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
                                  >
                                    Cancel Ticket
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No bookings made.</p>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

