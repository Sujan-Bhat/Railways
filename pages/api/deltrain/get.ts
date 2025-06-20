// pages/api/deltrain/get.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { train_id } = req.query;

  if (!train_id) {
    return res.status(400).json({ message: "Train ID is required" });
  }

  try {
    // Fetch train details.
    const [trainRows]: any = await pool.query(
      "SELECT train_id, train_number, train_name, type, total_coaches FROM trains WHERE train_id = ?",
      [train_id]
    );
    if (!trainRows.length) {
      return res.status(404).json({ message: "Train not found" });
    }
    const train = trainRows[0];

    // Fetch coach details, including coach_id.
    const [coachRows]: any = await pool.query(
      "SELECT coach_id, coach_type, coach_number, capacity FROM coaches WHERE train_id = ? ORDER BY coach_number",
      [train_id]
    );

    // Map each row and include coach_id.
    const coachDetails = coachRows.map((row: any) => ({
      coach_id: row.coach_id,  // Include this so the UI can send it back.
      coachType: row.coach_type,
      coachNumber: row.coach_number,
      quantity: "1",  // Each row represents one coach.
      capacity: String(row.capacity),
    }));

    return res.status(200).json({
      train_id: train.train_id,
      train_number: train.train_number,
      train_name: train.train_name,
      type: train.type,
      total_coaches: train.total_coaches,
      coachDetails,
    });
  } catch (error: any) {
    console.error("Error fetching train:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

