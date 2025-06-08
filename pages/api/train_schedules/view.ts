import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {

    const query = `
      SELECT 
        ts.schedule_id,
        t.train_name,
        s.station_name,
        ts.arrival_time,
        ts.departure_time,
        s.city
      FROM train_schedules ts
      JOIN trains t ON ts.train_id = t.train_id
      JOIN stations s ON ts.station_id = s.station_id
      ORDER BY s.station_name ASC, ts.arrival_time ASC
    `;
    const [rows]: any = await pool.query(query);
    return res.status(200).json({ schedules: rows });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

