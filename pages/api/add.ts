import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db"; //mysql pool connection

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Destructure values from the request body.
  // (Note: here we expect "trainType" even though the DB column is named "type".)
  const { trainNo, trainName, trainType, coachDetails } = req.body;

  // Validate required fields.
  if (!trainNo || !trainName || trainType === undefined || !coachDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Ensure coachDetails is an array.
  if (!Array.isArray(coachDetails)) {
    return res.status(400).json({ message: "Coach details must be an array" });
  }

  // Calculate the total number of coaches by summing the quantities
  const totalCoaches = coachDetails.reduce((sum: number, item: any) => {
    return sum + Number(item.quantity);
  }, 0);

  try {
    // 1. Insert the train record into the trains table.
    // The table columns are: train_number, train_name, type, total_coaches.
    const insertQuery = `
      INSERT INTO trains (train_number, train_name, type, total_coaches)
      VALUES (?, ?, ?, ?)
    `;
    const [result]: any = await pool.query(insertQuery, [
      trainNo,
      trainName,
      trainType, // This goes into the "type" column.
      totalCoaches,
    ]);

    // Get the newly inserted train's id:
    const trainId = result.insertId;

    // 2. Loop through each coach detail object from the payload and insert rows into the coaches table.
    for (const detail of coachDetails) {
      const { coachType, quantity, capacity } = detail;

      // Determine a prefix for coach_number based on coachType.
      let prefix: string;
      switch (coachType) {
        case "AC First":
          prefix = "ACF";
          break;
        case "AC Second":
          prefix = "ACS";
          break;
        case "Sleeper":
          prefix = "SLP";
          break;
        case "General":
          prefix = "GEN";
          break;
        default:
          prefix = "COACH";
      }

      // Loop from 1 up to the quantity (converted to a number) for this coach type.
      for (let i = 1; i <= Number(quantity); i++) {
        // Generate a coach_number (e.g., "ACF-1", "ACF-2", etc.)
        const coachNumber = `${prefix}-${i}`;

        // Insert the coach record into the coaches table.
        const coachQuery = `
          INSERT INTO coaches (train_id, coach_type, coach_number, capacity)
          VALUES (?, ?, ?, ?)
        `;
        await pool.query(coachQuery, [trainId, coachType, coachNumber, capacity]);
      }
    }

    return res.status(201).json({
      message: "Train and coaches added successfully",
      trainId,
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Train number already exists" });
    }
    console.error("DB error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

