import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");      // ← NEW
  const [isSuccess, setIsSuccess] = useState(null); // ← NEW
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      login(decodedPayload.name, token);

      setMessage("Login successful!");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage("Login failed: " + (err.response?.data?.message || err.message));
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px", margin: "auto" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>

      <span
        onClick={() => navigate("/register")}
        style={{
          fontSize: "0.85rem",
          color: "blue",
          marginTop: "0.25rem",
          textAlign: "center",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        or register
      </span>




      {/* Message box */}
      {message && (
        <div
          style={{
            marginTop: "0.5rem",
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
    </form>
  );
}