// pages/api/deltrain/update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

// (Optional) Helper function for prefix; used when computing coachNumber for new rows.
function getPrefix(coachType: string): string {
  switch (coachType) {
    case "AC First":
      return "ACF";
    case "AC Second":
      return "ACS";
    case "Sleeper":
      return "SLP";
    case "General":
      return "GEN";
    default:
      return "COACH";
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Expect these fields in the update payload.
  const { train_id, trainNo, trainName, type, coachDetails } = req.body;
  if (!train_id || !trainNo || !trainName || type === undefined || !coachDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Now, coachDetails should be an array.  
  if (!Array.isArray(coachDetails)) {
    return res.status(400).json({ message: "Coach details must be an array" });
  }

  // Use the number of coach details in the payload as the final total.
  const totalCoaches = coachDetails.length;

  try {
    // 1. Update the train record in the trains table.
    const updateTrainQuery = `
      UPDATE trains 
      SET train_number = ?, train_name = ?, type = ?, total_coaches = ? 
      WHERE train_id = ?
    `;
    await pool.query(updateTrainQuery, [trainNo, trainName, type, totalCoaches, train_id]);

    // 2. Fetch the currently stored coach_ids for this train.
    const [existingRows]: any = await pool.query(
      "SELECT coach_id FROM coaches WHERE train_id = ?",
      [train_id]
    );
    const existingIds = existingRows.map((row: any) => row.coach_id);

    // 3. Process each coachDetail from the UI.
    // We'll collect the coach_ids coming from the UI so that we can delete any removed ones.
    let uiCoachIds: number[] = [];
    for (const detail of coachDetails) {
      // If this row represents an existing record (has coach_id) then update.
      if (detail.coach_id) {
        const updateCoachQuery = `
          UPDATE coaches 
          SET coach_type = ?, coach_number = ?, capacity = ? 
          WHERE coach_id = ?
        `;
        await pool.query(updateCoachQuery, [
          detail.coachType,
          detail.coachNumber,
          detail.capacity,
          detail.coach_id,
        ]);
        uiCoachIds.push(Number(detail.coach_id));
      } else {
        // Otherwise, insert a new coach record.
        const insertCoachQuery = `
          INSERT INTO coaches (train_id, coach_type, coach_number, capacity)
          VALUES (?, ?, ?, ?)
        `;
        await pool.query(insertCoachQuery, [
          train_id,
          detail.coachType,
          detail.coachNumber,
          detail.capacity,
        ]);
      }
    }

    // 4. Delete any coach records that exist in the DB but were removed in the UI.
    const idsToDelete = existingIds.filter((id: number) => !uiCoachIds.includes(id));
    for (const id of idsToDelete) {
      await pool.query("DELETE FROM coaches WHERE coach_id = ?", [id]);
    }

    return res.status(200).json({ message: "Train updated successfully" });
  } catch (error: any) {
    console.error("Error updating train:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

