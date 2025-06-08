// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db";
import { hash } from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phone, email, password, fullname, dob, gender, address, aadhaar } = req.body;

  try {
    // Check if a user with the same email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    const [existing]: any = await pool.query(checkQuery, [email]);

    if (existing.length > 0) {
      // User exists: return conflict status with a message
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before insertion using bcryptjs with 12 salt rounds
    const hashedPassword = await hash(password, 12);

    // Insert the new record using the hashed password
    const insertQuery = `
      INSERT INTO users (phone, email, password, fullname, dob, gender, address, aadhaar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.query(insertQuery, [
      phone,
      email,
      hashedPassword,
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

