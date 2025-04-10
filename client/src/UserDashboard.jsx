import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/slots/myBookings`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        My Appointments
      </h2>

      {bookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No upcoming appointments.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((slot) => (
            <div
              key={slot._id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                borderLeft: "4px solid #222",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem", fontWeight: "600" }}>
                {formatDate(slot.date)} @ {slot.time}
              </h4>
              <p style={{ margin: 0, color: "#444" }}>
                <strong>Location:</strong> {slot.location}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Contact Message */}
      <div
        style={{
          marginTop: "2.5rem",
          textAlign: "center",
          color: "#888",
          fontSize: "0.95rem",
        }}
      >
        Need to cancel? Contact me at <strong>(661) 313-3802</strong>
      </div>
    </div>
  );
}