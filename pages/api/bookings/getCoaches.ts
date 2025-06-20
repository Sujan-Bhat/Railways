// pages/api/getCoaches.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

type Coach = {
  coach_id: number;
  coach_type: string;
  coach_number: string;
  capacity: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coach[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { trainId } = req.query;
  if (!trainId) {
    res.status(400).json({ error: "Missing trainId parameter" });
    return;
  }

  try {
    const query = `
      SELECT coach_id, coach_type, coach_number, capacity
      FROM coaches
      WHERE train_id = ?
    `;
    const [rows] = await pool.execute(query, [trainId]);
    res.status(200).json(rows as Coach[]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

