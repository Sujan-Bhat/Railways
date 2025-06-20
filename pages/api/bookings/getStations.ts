// pages/api/getStations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

type Station = {
  station_id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Station[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const query = `
      SELECT station_id, station_code, station_name, city, state 
      FROM stations 
      ORDER BY station_name
    `;
    const [rows] = await pool.execute(query);
    res.status(200).json(rows as Station[]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

