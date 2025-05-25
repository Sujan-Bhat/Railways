import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT train_id, train_number, train_name, type, total_coaches FROM trains ORDER BY train_id DESC"
    );
    res.status(200).json({ trains: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching trains" });
  }
}
