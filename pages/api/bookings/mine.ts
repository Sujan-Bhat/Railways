// File: pages/api/bookings/mine.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests.
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  
  // Get the session.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user_id = session.user?.id;
  
  try {
    const query = `
      SELECT 
        b.booking_id,
        b.journey_date,
        ts.arrival_time,
        p.passenger_id,
        p.passenger_name,
        p.age,
        p.gender,
        p.seat_number
      FROM bookings b
      LEFT JOIN train_schedules ts 
        ON b.train_id = ts.train_id 
        AND b.to_station_id = ts.station_id
      LEFT JOIN passengers p 
        ON b.booking_id = p.booking_id
      WHERE b.user_id = ?
      ORDER BY b.booking_id DESC
    `;
    const [rows]: any = await pool.query(query, [user_id]);

    // Group rows by booking_id so each booking includes its passengers and arrival time.
    const bookingsMap: { [key: number]: any } = {};
    rows.forEach((row: any) => {
      // Initialize the booking if it hasn't been seen yet.
      if (!bookingsMap[row.booking_id]) {
        bookingsMap[row.booking_id] = {
          booking_id: row.booking_id,
          journey_date: row.journey_date,
          arrival_time: row.arrival_time, // new field from train_schedules
          passengers: []
        };
      }
      // Add passenger details if available.
      if (row.passenger_id !== null) {
        bookingsMap[row.booking_id].passengers.push({
          passenger_id: row.passenger_id,
          passenger_name: row.passenger_name,
          age: row.age,
          gender: row.gender,
          seat_number: row.seat_number
        });
      }
    });

    const bookings = Object.values(bookingsMap);
    return res.status(200).json({ bookings });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

