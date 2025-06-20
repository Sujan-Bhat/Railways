// pages/api/bookings/bookTickets.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// We now remove seat_number from the payload.
type PassengerPayload = {
  passenger_name: string;
  age: number | string;
  gender: string;
};

type BookingPayload = {
  train_id: number;
  journey_date: string;
  from_station_id: string;
  to_station_id: string;
  coach_id: string; // now include coach_id so we know which coach to assign seats in
  passengers: PassengerPayload[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; booking_id?: number; error?: string }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  // Get the session to ensure the booking is tied to a logged-in user.
  const session = await getServerSession(req, res, authOptions);
  console.log("Session from getServerSession:", session);
if (!session || !session.user) {
  res.status(401).json({ success: false, error: "Unauthorized" });
  return;
}
  
  // Adjust as needed based on your session structure.
  const user_id = session.user.id;

  const {
    train_id,
    journey_date,
    from_station_id,
    to_station_id,
    coach_id,
    passengers,
  } = req.body as BookingPayload;

  if (!train_id || !journey_date || !from_station_id || !to_station_id || !passengers || !coach_id) {
    res.status(400).json({ success: false, error: "Missing required fields" });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert a new booking record. Notice that we now also save coach_id.
    const insertBookingQuery = `
      INSERT INTO bookings (user_id, train_id, journey_date, from_station_id, to_station_id, coach_id, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `;

    
console.log("Booking Query Parameters:", {
  user_id, train_id, journey_date, from_station_id, to_station_id, coach_id
});
    const [bookingResult] = await connection.execute(insertBookingQuery, [
      user_id,
      train_id,
      journey_date,
      from_station_id,
      to_station_id,
      coach_id,
    ]);
    const booking_id = (bookingResult as any).insertId;

    // Retrieve coach details so that we can form a seat number prefix.
    // For example, if coach_type is "Sleeper", we might use "SL" as the prefix.
    const [coachRows] = await connection.execute(
      "SELECT coach_type FROM coaches WHERE coach_id = ?",
      [coach_id]
    );
    if ((coachRows as any).length === 0) {
      throw new Error("Invalid coach_id provided.");
    }
    const coachType = (coachRows as any)[0].coach_type as string;
    const prefix = coachType.substring(0, 2).toUpperCase();

    // Query how many seats are already booked on this train, journey, and coach.
    // This helps with generating a unique, sequential seat number.
    const countQuery = `
      SELECT COUNT(*) as count
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.booking_id
      WHERE b.train_id = ? AND b.journey_date = ? AND b.coach_id = ?
    `;
    const [countRows] = await connection.execute(countQuery, [train_id, journey_date, coach_id]);
    const currentCount = (countRows as any)[0].count as number;

    // Define the INSERT statement for each passenger.
    const insertPassengerQuery = `
      INSERT INTO passengers (booking_id, passenger_name, age, gender, seat_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Start seat numbering from the current count.
    let seatIndex = currentCount;
    for (const passenger of passengers) {
      seatIndex++; // Increment for each new passenger.
      // Generate seat number in the form "XX-YYY", e.g., "SL-001"
      const seatNumber = `${prefix}-${seatIndex.toString().padStart(3, "0")}`;
      await connection.execute(insertPassengerQuery, [
        booking_id,
        passenger.passenger_name,
        passenger.age,
        passenger.gender,
        seatNumber,
      ]);
    }

    await connection.commit();
    res.status(200).json({ success: true, booking_id });
  } catch (error: any) {
    await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
}

