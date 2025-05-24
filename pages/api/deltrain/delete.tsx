import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db"; // Adjust the path as needed for your project

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { train_id } = req.body;

  if (!train_id) {
    return res.status(400).json({ message: "Train ID is required" });
  }

  try {
    const deleteQuery = `DELETE FROM train WHERE train_id = ?`;
    const [result]: any = await pool.query(deleteQuery, [train_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    return res.status(200).json({ message: "Train deleted successfully" });
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}