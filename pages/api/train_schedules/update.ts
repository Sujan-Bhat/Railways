import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { schedule_id, train_id, station_id, arrival_time, departure_time, stop_sequence, journey_day } = req.body;
  if (!schedule_id || !train_id || !station_id || !arrival_time || !departure_time || stop_sequence === undefined) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const query = `
      UPDATE train_schedules
      SET train_id = ?,
          station_id = ?,
          arrival_time = ?,
          departure_time = ?,
          stop_sequence = ?,
          journey_day = ?
      WHERE schedule_id = ?
    `;
    const values = [
      train_id,
      station_id,
      arrival_time,
      departure_time,
      stop_sequence,
      journey_day || 0,
      schedule_id,
    ];
    const [result]: any = await pool.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Schedule not found." });
    }
    return res.status(200).json({ message: "Schedule updated successfully." });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

