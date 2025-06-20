// File: pages/api/users/details.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET requests.
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Authenticate the user.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user_id = session.user?.id;

  try {
    const query = `
      SELECT 
        user_id AS id, 
        fullname AS name, 
        email, 
        phone, 
        dob, 
        gender, 
        address, 
        aadhaar, 
        created_at
      FROM users 
      WHERE user_id = ?
    `;
    const [rows]: any = await pool.query(query, [user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the first (and only) record.
    return res.status(200).json({ user: rows[0] });
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

