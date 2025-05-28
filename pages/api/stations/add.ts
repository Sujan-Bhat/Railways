import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db"; // Adjust the path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { station_code, station_name, city, state } = req.body;

  if (!station_code || !station_name || !city || !state) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for duplicate station name
    const [existing]: any = await pool.query(
      "SELECT station_id FROM stations WHERE station_name = ?",
      [station_name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Station name already exists" });
    }

    // Insert into DB
    const insertQuery = `
      INSERT INTO stations (station_code, station_name, city, state)
      VALUES (?, ?, ?, ?)
    `;
    const [result]: any = await pool.query(insertQuery, [
      station_code,
      station_name,
      city,
      state,
    ]);

    return res.status(201).json({ message: "Station added successfully", stationId: result.insertId });
  } catch (error: any) {
    console.error("Error inserting station:", error);
    return res.status(500).json({ message: "Failed to add station" });
  }
}