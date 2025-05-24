import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db"; // your mysql pool connection

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { trainNo, trainName, trainType, coaches } = req.body;

  // Validate required fields
  if (!trainNo || !trainName || trainType === undefined || coaches === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (Number(coaches) < 0) {
    return res.status(400).json({ message: "Total coaches cannot be negative" });
  }

  try {
    const insertQuery = `
      INSERT INTO train (train_num, train_name, train_type, total_coaches)
      VALUES (?, ?, ?, ?)
    `;

    const [result]: any = await pool.query(insertQuery, [
      trainNo,
      trainName,
      trainType,
      Number(coaches),
    ]);

    return res.status(201).json({ message: "Train added successfully", trainId: result.insertId });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Train number already exists" });
    }
    console.error("DB error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}