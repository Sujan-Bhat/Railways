"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Head from "next/head";

interface Schedule {
  schedule_id: number;
  train_id: number;
  station_id: number;
  arrival_time: string;
  departure_time: string;
  stop_sequence: number;
  journey_day: number;
}

export default function ManageSchedules() {
  // Schedules list state
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state for adding/editing schedules
  const [formData, setFormData] = useState({
    schedule_id: "",
    train_id: "",
    station_id: "",
    arrival_time: "",
    departure_time: "",
    stop_sequence: "",
    journey_day: "0",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all schedules from API endpoint
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/train_schedules/list");
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data.schedules);
    } catch (err: any) {
      setError(err.message || "Error fetching schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form fields to initial state
  const resetForm = () => {
    setFormData({
      schedule_id: "",
      train_id: "",
      station_id: "",
      arrival_time: "",
      departure_time: "",
      stop_sequence: "",
      journey_day: "0",
    });
    setEditing(false);
  };

  // Add a new schedule record
  const handleAddSchedule = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/train_schedules/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          train_id: formData.train_id,
          station_id: formData.station_id,
          arrival_time: formData.arrival_time,
          departure_time: formData.departure_time,
          stop_sequence: Number(formData.stop_sequence),
          journey_day: Number(formData.journey_day),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add schedule");
      setMessage("Schedule added successfully.");
      resetForm();
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Error adding schedule");
    }
  };

  // Update an existing schedule
  const handleUpdateSchedule = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/train_schedules/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: formData.schedule_id,
          train_id: formData.train_id,
          station_id: formData.station_id,
          arrival_time: formData.arrival_time,
          departure_time: formData.departure_time,
          stop_sequence: Number(formData.stop_sequence),
          journey_day: Number(formData.journey_day),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update schedule");
      setMessage("Schedule updated successfully.");
      resetForm();
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Error updating schedule");
    }
  };

  // Delete a schedule record
  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/train_schedules/delete?schedule_id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete schedule");
      setMessage("Schedule deleted successfully.");
      fetchSchedules();
    } catch (err: any) {
      setError(err.message || "Error deleting schedule");
    }
  };

  // Populate form fields for editing when clicking Edit button.
  const handleEditClick = (schedule: Schedule) => {
    setEditing(true);
    setFormData({
      schedule_id: schedule.schedule_id.toString(),
      train_id: schedule.train_id.toString(),
      station_id: schedule.station_id.toString(),
      arrival_time: schedule.arrival_time,
      departure_time: schedule.departure_time,
      stop_sequence: schedule.stop_sequence.toString(),
      journey_day: schedule.journey_day.toString(),
    });
  };

  return (
    <>
      <Head>
        <title>Manage Train Schedules</title>
      </Head>
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-black mb-8">
            Manage Train Schedules
          </h1>

          {message && (
            <p className="text-black text-center mb-4 font-semibold">
              {message}
            </p>
          )}
          {error && (
            <p className="text-black text-center mb-4 font-semibold">
              {error}
            </p>
          )}

          {/* Form for Add / Edit – styled with a gentle gray background and rounded corners */}
          <form
            onSubmit={editing ? handleUpdateSchedule : handleAddSchedule}
            className="bg-gray-50 p-4 rounded shadow mb-8 space-y-4"
          >
            {editing && (
              <div>
                <label className="block text-black font-semibold mb-1">
                  Schedule ID
                </label>
                <input
                  type="text"
                  name="schedule_id"
                  value={formData.schedule_id}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-black"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-semibold mb-1">
                  Train ID
                </label>
                <input
                  type="number"
                  name="train_id"
                  value={formData.train_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  Station ID
                </label>
                <input
                  type="number"
                  name="station_id"
                  value={formData.station_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  Arrival Time
                </label>
                <input
                  type="time"
                  name="arrival_time"
                  value={formData.arrival_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  Departure Time
                </label>
                <input
                  type="time"
                  name="departure_time"
                  value={formData.departure_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  Stop Sequence
                </label>
                <input
                  type="number"
                  name="stop_sequence"
                  value={formData.stop_sequence}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-1">
                  Journey Day
                </label>
                <input
                  type="number"
                  name="journey_day"
                  value={formData.journey_day}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded"
            >
              {editing ? "Update Schedule" : "Add Schedule"}
            </button>
          </form>

          {/* Schedules List */}
          {loading ? (
            <p className="text-center text-black">Loading schedules...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 text-black">ID</th>
                    <th className="border p-2 text-black">Train ID</th>
                    <th className="border p-2 text-black">Station ID</th>
                    <th className="border p-2 text-black">Arrival</th>
                    <th className="border p-2 text-black">Departure</th>
                    <th className="border p-2 text-black">Sequence</th>
                    <th className="border p-2 text-black">Day</th>
                    <th className="border p-2 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((sch) => (
                    <tr key={sch.schedule_id}>
                      <td className="border p-2 text-black">{sch.schedule_id}</td>
                      <td className="border p-2 text-black">{sch.train_id}</td>
                      <td className="border p-2 text-black">{sch.station_id}</td>
                      <td className="border p-2 text-black">{sch.arrival_time}</td>
                      <td className="border p-2 text-black">{sch.departure_time}</td>
                      <td className="border p-2 text-black">{sch.stop_sequence}</td>
                      <td className="border p-2 text-black">{sch.journey_day}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleEditClick(sch)}
                          className="py-1 px-2 bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(sch.schedule_id)}
                          className="py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

