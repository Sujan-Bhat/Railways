// pages/api/passengers/view.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests.
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    /*  
      We join:
        - passengers p
        - bookings b: on p.booking_id = b.booking_id
        - trains t: on b.train_id = t.train_id
        - stations s_from: on b.from_station_id = s_from.station_id
        - stations s_to: on b.to_station_id = s_to.station_id
    */
    const query = `
      SELECT 
        p.passenger_id,
        p.passenger_name,
        p.age,
        p.gender,
        p.seat_number,
        DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        t.train_name,
        s_from.station_name AS from_station,
        s_to.station_name AS to_station
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN trains t ON b.train_id = t.train_id
      JOIN stations s_from ON b.from_station_id = s_from.station_id
      JOIN stations s_to ON b.to_station_id = s_to.station_id
      ORDER BY p.passenger_id DESC
    `;
    const [rows]: any = await pool.query(query);
    return res.status(200).json({ passengers: rows });
  } catch (error) {
    console.error("Error fetching passenger details:", error);
    return res.status(500).json({ message: "Server error." });
  }
}


