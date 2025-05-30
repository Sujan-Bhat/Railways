import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const [rows]: any = await pool.query("SELECT station_id, station_code, station_name, city, state FROM stations ORDER BY station_id DESC");
    return res.status(200).json({ stations: rows });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
