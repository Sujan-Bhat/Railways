import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { schedule_id } = req.query;
  if (!schedule_id) {
    return res.status(400).json({ message: "Schedule ID is required." });
  }

  try {
    const query = "DELETE FROM train_schedules WHERE schedule_id = ?";
    const [result]: any = await pool.query(query, [schedule_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Schedule not found." });
    }
    return res.status(200).json({ message: "Schedule deleted successfully." });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

