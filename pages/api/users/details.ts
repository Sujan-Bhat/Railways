// pages/api/users/details.ts
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
    const [rows]: any = await pool.query(
      "SELECT fullname AS name, email, gender FROM users WHERE user_id = ?",
      [user_id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

