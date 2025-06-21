// pages/api/bookings/bookTickets.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
  coach_id: string;
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
  
  const user_id = session.user.id;

  const {
    train_id,
    journey_date,
    from_station_id,
    to_station_id,
    coach_id,
    passengers,
  } = req.body as BookingPayload;

  if (
    !train_id ||
    !journey_date ||
    !from_station_id ||
    !to_station_id ||
    !passengers ||
    !coach_id
  ) {
    res.status(400).json({ success: false, error: "Missing required fields" });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // ========================================================
    // Step 1. Compute the total fare (same as the fare preview logic).
    // ========================================================

    // Get train type.
    const [trainRows] = await connection.execute(
      "SELECT type FROM trains WHERE train_id = ?",
      [train_id]
    );
    if ((trainRows as any).length === 0) {
      throw new Error("Invalid train_id provided.");
    }
    const trainType = (trainRows as any)[0].type as string;

    // Get coach type.
    const [coachRows] = await connection.execute(
      "SELECT coach_type FROM coaches WHERE coach_id = ?",
      [coach_id]
    );
    if ((coachRows as any).length === 0) {
      throw new Error("Invalid coach_id provided.");
    }
    const coachType = (coachRows as any)[0].coach_type as string;
    
 const [coachNum] = await connection.execute(
      "SELECT coach_number FROM coaches WHERE coach_id = ?",
      [coach_id]
    );
    if ((coachNum as any).length === 0) {
      throw new Error("Invalid coach_id provided.");
    }
    const coachTypebook = (coachNum as any)[0].coach_number as string;




    // Get stop_sequence for departure.
    const [fromScheduleRows] = await connection.execute(
      "SELECT stop_sequence FROM train_schedules WHERE train_id = ? AND station_id = ?",
      [train_id, from_station_id]
    );
    if ((fromScheduleRows as any).length === 0) {
      throw new Error("Departure station not found in train schedules");
    }
    const fromStopSequence = (fromScheduleRows as any)[0].stop_sequence as number;

    // Get stop_sequence for arrival.
    const [toScheduleRows] = await connection.execute(
      "SELECT stop_sequence FROM train_schedules WHERE train_id = ? AND station_id = ?",
      [train_id, to_station_id]
    );
    if ((toScheduleRows as any).length === 0) {
      throw new Error("Arrival station not found in train schedules");
    }
    const toStopSequence = (toScheduleRows as any)[0].stop_sequence as number;

    // Compute stop difference.
    const stopDiff = Math.abs(toStopSequence - fromStopSequence);
    const baseRatePerStop = 50;

    const coachFareMultiplier: Record<string, number> = {
      Sleeper: 1.0,
      AC: 1.5,
      General: 0.75,
      "First Class": 2.0,
    };
    const trainFareMultiplier: Record<string, number> = {
      Express: 1.2,
      Local: 1.0,
      Intercity: 1.1,
      Superfast: 1.3,
    };
    const coachMultiplier = coachFareMultiplier[coachType] || 1.0;
    const trainMultiplier = trainFareMultiplier[trainType] || 1.0;

    const farePerPassenger =
      stopDiff * baseRatePerStop * coachMultiplier * trainMultiplier;
    const totalFareCalculated = farePerPassenger * passengers.length;

    // ========================================================
    // Step 2. Insert booking record with the computed total_fare.
    // ========================================================
    const insertBookingQuery = `
      INSERT INTO bookings 
        (user_id, train_id, journey_date, from_station_id, to_station_id, coach_id, total_fare, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    `;
    console.log("Booking Query Parameters:", {
      user_id,
      train_id,
      journey_date,
      from_station_id,
      to_station_id,
      coach_id,
      total_fare: totalFareCalculated,
    });
    const [bookingResult] = await connection.execute(insertBookingQuery, [
      user_id,
      train_id,
      journey_date,
      from_station_id,
      to_station_id,
      coach_id,
      totalFareCalculated,
    ]);
    const booking_id = (bookingResult as any).insertId;

    // ========================================================
    // Step 3. Insert each passenger with auto-generated seat numbers.
    // ========================================================
    // Use the first two letters of coach_type as the prefix.
    const prefix = coachTypebook.substring(0, 5).toUpperCase();

    // Get the count of existing passengers for this train, journey and coach.
    const countQuery = `
      SELECT COUNT(*) as count
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.booking_id
      WHERE b.train_id = ? AND b.journey_date = ? AND b.coach_id = ?
    `;
    const [countRows] = await connection.execute(countQuery, [
      train_id,
      journey_date,
      coach_id,
    ]);
    const currentCount = (countRows as any)[0].count as number;

    const insertPassengerQuery = `
      INSERT INTO passengers 
        (booking_id, passenger_name, age, gender, seat_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    let seatIndex = currentCount;
    for (const passenger of passengers) {
      seatIndex++;
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

