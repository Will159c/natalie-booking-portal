import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setMessage(res.data.message || "Account created! Please check your email to verify.");
      setIsSuccess(true);
      setShowResend(true);
    } catch (err) {
      setMessage("Registration failed: " + (err.response?.data?.message || err.message));
      setIsSuccess(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/resend", { email });
      setMessage(res.data.message || "Verification email resent!");
      setIsSuccess(true);
    } catch (err) {
      setMessage("Error resending email: " + (err.response?.data?.message || err.message));
      setIsSuccess(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f9f9f9",
        paddingTop: "10vh",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
          maxWidth: "350px",
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: "500" }}>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Register
        </button>

        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "none",
              color: "#007bff",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.85rem",
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            Resend Verification Email
          </button>
        )}

        {message && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem",
              borderRadius: "5px",
              backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
              color: isSuccess ? "#155724" : "#721c24",
              border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}