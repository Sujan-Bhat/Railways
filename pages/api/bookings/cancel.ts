// File: pages/api/bookings/cancel.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST method.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Ensure the user is authenticated.
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Parse booking_id and passenger_id from the request body.
  const { booking_id, passenger_id } = req.body;
  if (!booking_id || !passenger_id) {
    return res
      .status(400)
      .json({ message: "booking_id and passenger_id are required" });
  }

  let connection: any;
  try {
    // Get a connection for transactional queries.
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Delete the passenger record.
    const [deleteResult] = await connection.query(
      `DELETE FROM passengers WHERE booking_id = ? AND passenger_id = ?`,
      [booking_id, passenger_id]
    );

    // Optionally, you might check that exactly 1 row was deleted:
    // if (deleteResult.affectedRows !== 1) { ... }

    // Check if any passengers remain for this booking.
    const [countRows]: any = await connection.query(
      `SELECT COUNT(*) as cnt FROM passengers WHERE booking_id = ?`,
      [booking_id]
    );

    if (countRows[0].cnt === 0) {
      // If no passengers remain, update the booking status to "cancelled".
      await connection.query(
        `UPDATE bookings SET status = 'cancelled' WHERE booking_id = ?`,
        [booking_id]
      );
    }

    // Commit the transaction.
    await connection.commit();
    return res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (error: any) {
    // Rollback the transaction in case of any error.
    if (connection) await connection.rollback();
    console.error("Cancellation error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    // Release the connection back to the pool.
    if (connection) connection.release();
  }
}

