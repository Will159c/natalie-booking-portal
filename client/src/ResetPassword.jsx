import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import zxcvbn from "zxcvbn";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [strength, setStrength] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }

    if (!strength || strength.score < 2) {
      setMessage("Password must be stronger");
      setIsSuccess(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset successful!");
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed.");
      setIsSuccess(false);
    }
  };

  const strengthLabel = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
  const strengthColor = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "start", paddingTop: "10vh", background: "#f9f9f9" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: "500" }}>Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          required
          onChange={(e) => {
            const val = e.target.value;
            setPassword(val);
            setStrength(zxcvbn(val));
          }}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            width: "100%",
            marginTop: "1rem",
          }}
        />

        {strength && (
          <div style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                height: "8px",
                width: "100%",
                backgroundColor: "#eee",
                borderRadius: "4px",
                marginBottom: "0.25rem",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(strength.score / 4) * 100}%`,
                  backgroundColor: strengthColor[strength.score],
                  borderRadius: "4px",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              {strengthLabel[strength.score]}
            </span>
          </div>
        )}

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            width: "100%",
            marginTop: "1rem",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.6rem",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
            marginTop: "1rem",
            fontWeight: "bold",
          }}
        >
          Reset Password
        </button>

        {message && (
          <div
            style={{
              marginTop: "1rem",
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

