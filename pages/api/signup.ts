// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phone, email, password, fullname, dob, gender, address, aadhaar } = req.body;

  try {
    // Make sure the table 'users' exists in your 'railways' database
    const query = `
      INSERT INTO users (phone, email, password, fullname, dob, gender, address, aadhaar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.query(query, [
      phone,
      email,
      password,
      fullname,
      dob,
      gender,
      address,
      aadhaar,
    ]);

    return res.status(200).json({ message: "User created", userId: result.insertId });
  } catch (error) {
    console.error("DB error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

