// pages/api/booking.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Get the current session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Please log in." });
  }
  
  // Fetch the logged-in user's ID from the session
  const user_id = session.user?.id;
  
  // Extract the booking details from the request body (exclude user_id)
  const { train_id, from_station_id, to_station_id, journey_date, status } = req.body;

  // Validate required fields
  if (!user_id || !train_id || !from_station_id || !to_station_id || !journey_date || !status) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const query = `
      INSERT INTO bookings (user_id, train_id, journey_date, from_station_id, to_station_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [user_id, train_id, journey_date, from_station_id, to_station_id, status];

    const [result]: any = await pool.query(query, values);
    return res.status(200).json({ booking_id: result.insertId, message: "Booking successful!" });
  } catch (error) {
    console.error("Error booking ticket:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

