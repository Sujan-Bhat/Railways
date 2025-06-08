// pages/api/bookings/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Helper function to calculate age from the date of birth.
function calculateAge(dob: string): number {
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Retrieve the session to ensure the user is logged in.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Please log in." });
  }
  // Use the session's user information.
  const user_id = session.user?.id;
  const userName = session.user?.name;

  // Extract booking details from the request body.
  const { train_id, from_station_id, to_station_id, journey_date, status } = req.body;

  // Validate that all required fields are present.
  if (!user_id || !train_id || !from_station_id || !to_station_id || !journey_date || !status) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Insert a new booking into the bookings table.
    const bookingQuery = `
      INSERT INTO bookings (user_id, train_id, journey_date, from_station_id, to_station_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const bookingValues = [user_id, train_id, journey_date, from_station_id, to_station_id, status];
    const [bookingResult]: any = await pool.query(bookingQuery, bookingValues);
    const booking_id = bookingResult.insertId;

    // Retrieve the user's details (dob and gender) from the users table.
    const [userRows]: any = await pool.query("SELECT dob, gender FROM users WHERE user_id = ?", [user_id]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const { dob, gender } = userRows[0];
    const age = calculateAge(dob);

    // Allocate a seat number.
    // Count how many passengers are already booked on the same train for the same journey date.
    const seatQuery = `
      SELECT COUNT(*) AS count
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.booking_id
      WHERE b.train_id = ? AND b.journey_date = ?
    `;
    const [seatResult]: any = await pool.query(seatQuery, [train_id, journey_date]);
    const seatCount = seatResult[0].count;
    // Allocate the next seat number. (For example, seat number is "A" followed by count+1.)
    const seat_number = `A${seatCount + 1}`;

    // Insert a record into the passengers table using the booking ID, the user's name, age, gender, and allocated seat number.
    const passengerQuery = `
      INSERT INTO passengers (booking_id, passenger_name, age, gender, seat_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    const passengerValues = [booking_id, userName, age, gender, seat_number];
    await pool.query(passengerQuery, passengerValues);

    return res.status(200).json({ booking_id, message: "Booking successful!" });
  } catch (error) {
    console.error("Error booking ticket:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

