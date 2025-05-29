import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { train_id, station_id, arrival_time, departure_time, stop_sequence, journey_day } = req.body;
  if (!train_id || !station_id || !arrival_time || !departure_time || stop_sequence === undefined) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const query = `
      INSERT INTO train_schedules 
        (train_id, station_id, arrival_time, departure_time, stop_sequence, journey_day)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      train_id,
      station_id,
      arrival_time,
      departure_time,
      stop_sequence,
      journey_day || 0,
    ];
    await pool.query(query, values);
    return res.status(200).json({ message: "Schedule added successfully." });
  } catch (error) {
    console.error("Error adding schedule:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

