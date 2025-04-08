import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [slots, setSlots] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]); // New state for booked slots

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchSlots();
    fetchBookedSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/slots/getAvailableSlots");
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/slots/getBookedSlots",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        "http://localhost:5000/api/slots/createSlot",
        { date, time, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Slot created successfully!");
      setIsSuccess(true);
      setDate("");
      setTime("");
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
        "http://localhost:5000/api/slots/removeSlot",
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
        "http://localhost:5000/api/slots/unbookSlot",
        { slotId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchSlots(); 
    } catch (err) {
      alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
    }
  };
  
  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Create a Time Slot</h2>
      <form onSubmit={handleCreateSlot} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="text" value={time} placeholder="Time (e.g. 1:00 PM)" onChange={(e) => setTime(e.target.value)} required />
        <input type="text" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} required />
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
  
      <h3 style={{ marginTop: "2rem", textAlign: "center" }}>Existing Slots</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {slots.map((slot) => (
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
              {new Date(slot.date).toDateString()} @ {slot.time} ({slot.location})
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
        {bookedSlots.map((slot) => (
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
              <strong>{new Date(slot.date).toDateString()} @ {slot.time}</strong> ({slot.location})<br />
              <span><strong>Booked by:</strong> {slot.bookedBy?.name || 'Unknown'} ({slot.bookedBy?.email || 'No email'})</span>
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