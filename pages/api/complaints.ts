import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db"; // your mysql pool connection

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, phone, email, referTo, message } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !referTo || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO complaints (name, phone, email, referTo, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result]: any = await pool.query(insertQuery, [
      name,
      phone,
      email,
      referTo,
      message,
    ]);

    return res.status(201).json({ message: "Complaint submitted", complaintId: result.insertId });
  } catch (error) {
    console.error("DB error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
