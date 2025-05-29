import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const query = "SELECT * FROM train_schedules ORDER BY schedule_id DESC";
    const [rows]: any = await pool.query(query);
    return res.status(200).json({ schedules: rows });
  } catch (error) {
    console.error("Error listing schedules:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

