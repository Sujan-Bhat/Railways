// pages/api/searchTrains.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

type Train = {
  train_id: number;
  train_number: string;
  train_name: string;
  type: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Train[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { fromStation, toStation } = req.query;

  if (!fromStation || !toStation) {
    res.status(400).json({ error: "Missing station parameters" });
    return;
  }

  try {
    const query = `
      SELECT t.train_id, t.train_number, t.train_name, t.type
      FROM trains t
      JOIN train_schedules ts_from ON t.train_id = ts_from.train_id
      JOIN train_schedules ts_to ON t.train_id = ts_to.train_id
      WHERE ts_from.station_id = ? 
        AND ts_to.station_id = ?
        AND ts_from.stop_sequence < ts_to.stop_sequence
    `;
    const [rows] = await pool.execute(query, [fromStation, toStation]);
    res.status(200).json(rows as Train[]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

