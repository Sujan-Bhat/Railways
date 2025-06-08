// pages/api/bookings/mine.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user_id = session.user?.id;
  
  try {
    const query = `
      SELECT b.booking_id, b.journey_date, p.seat_number
      FROM bookings b
      LEFT JOIN passengers p ON b.booking_id = p.booking_id
      WHERE b.user_id = ?
    `;
    const [rows]: any = await pool.query(query, [user_id]);
    return res.status(200).json({ bookings: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

