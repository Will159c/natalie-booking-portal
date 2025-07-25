import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [slots, setSlots] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const token = localStorage.getItem("adminToken");
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Helper to convert time string to Date for sorting
  const timeToDate = (dateStr, timeStr) => new Date(`${dateStr} ${timeStr}`);

  // Generate 6:00 AM – 10:00 PM in 15-minute steps
  const timeOptions = Array.from({ length: (22 - 6 + 1) * 4 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = 6 + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });

  useEffect(() => {
    fetchSlots();
    fetchBookedSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/slots/getAvailableSlots`);
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/slots/getBookedSlots`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookedSlots(res.data);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/slots/createSlot`,
        { date, startTime, endTime, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Time block created successfully!");
      setIsSuccess(true);
      setDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      fetchSlots();
      fetchBookedSlots();
    } catch (err) {
      setMessage("Error creating slot: " + (err.response?.data?.message || err.message));
      setIsSuccess(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.post(
        `${API_URL}/api/slots/removeSlot`,
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeleteMessage("Slot deleted successfully!");
      setIsDeleteSuccess(true);
      setTimeout(() => {
        setDeleteMessage("");
        fetchSlots();
        fetchBookedSlots();
      }, 1000);
    } catch (err) {
      setDeleteMessage("Error deleting slot: " + (err.response?.data?.message || err.message));
      setIsDeleteSuccess(false);
    }
  };

  const handleUnbookSlot = async (slotId) => {
    try {
      await axios.post(
        `${API_URL}/api/slots/unbookSlot`,
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSlots();
      fetchBookedSlots();
    } catch (err) {
      alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Create a Time Slot</h2>
      <form
        onSubmit={handleCreateSlot}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
          <option value="">Start Time</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <select value={endTime} onChange={(e) => setEndTime(e.target.value)} required>
          <option value="">End Time</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={location}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Create Slot</button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: "5px",
            backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
            color: isSuccess ? "#155724" : "#721c24",
            border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {message}
        </div>
      )}

      {deleteMessage && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "5px",
            backgroundColor: isDeleteSuccess ? "#d4edda" : "#f8d7da",
            color: isDeleteSuccess ? "#155724" : "#721c24",
            border: `1px solid ${isDeleteSuccess ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {deleteMessage}
        </div>
      )}

      <h3 style={{ marginTop: "2rem", textAlign: "center" }}>Available Slots</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {[...slots]
          .sort((a, b) => timeToDate(a.date, a.time) - timeToDate(b.date, b.time))
          .map((slot) => (
            <li
              key={slot._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                padding: "0.5rem 0",
              }}
            >
              <span>
                {formatDate(slot.date)} @ {slot.time} ({slot.location})
              </span>
              <button
                onClick={() => handleDeleteSlot(slot._id)}
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>

      <h3 style={{ marginTop: "3rem", textAlign: "center" }}>Booked Slots</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {[...bookedSlots]
          .sort((a, b) => timeToDate(a.date, a.time) - timeToDate(b.date, b.time))
          .map((slot) => (
            <li
              key={slot._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                padding: "0.5rem 0",
              }}
            >
              <div>
                <strong>
                  {formatDate(slot.date)} @ {slot.time}
                </strong>{" "}
                ({slot.location})
                <br />
                <span>
                  <strong>Booked by:</strong> {slot.bookedBy?.name || "Unknown"} (
                  {slot.bookedBy?.email || "No email"})
                </span>
              </div>
              <button
                onClick={() => handleUnbookSlot(slot._id)}
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                Cancel Booking
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

