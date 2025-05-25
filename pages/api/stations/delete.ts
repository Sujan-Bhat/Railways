import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { station_id } = req.query;

  if (!station_id || Array.isArray(station_id)) {
    return res.status(400).json({ message: "station_id is required" });
  }

  try {
    const [result]: any = await pool.query("DELETE FROM stations WHERE station_id = ?", [station_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Station not found" });
    }

    return res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    console.error("Error deleting station:", error);
    return res.status(500).json({ message: "Server error" });
  }
}