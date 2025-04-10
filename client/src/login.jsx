import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useUser } from "./UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();
  const captchaRef = useRef(null);

  useEffect(() => {
    if (attempts >= 5) {
      setIsLocked(true);
      setMessage("Too many failed attempts. Try again in 30 seconds.");
      setTimeout(() => {
        setAttempts(0);
        setIsLocked(false);
        setMessage("");
        captchaRef.current?.reset();
        setCaptchaValue(null);
      }, 30000);
    }
  }, [attempts]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLocked) return;

    if (!email.trim() || !password.trim()) {
      setIsSuccess(false);
      setMessage("Invalid email or password");
      return;
    }

    if (attempts >= 2 && !captchaValue) {
      setIsSuccess(false);
      setMessage("Please complete the CAPTCHA");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
        captcha: captchaValue,
      });

      const token = res.data.token;
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      login(decodedPayload.name, token);

      if (decodedPayload.isAdmin) {
        localStorage.setItem("adminToken", token);
      }

      setMessage("Login successful!");
      setIsSuccess(true);
      setAttempts(0);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setIsSuccess(false);
      setMessage("Invalid email or password");
      setAttempts((prev) => prev + 1);

      if (captchaRef.current && attempts >= 2) {
        captchaRef.current.reset();
        setCaptchaValue(null);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        background: "#f9f9f9",
        paddingTop: "10vh",
      }}
    >
      <form
        onSubmit={handleLogin}
        noValidate
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
        <h2 style={{ textAlign: "center", fontWeight: "500" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={isLocked}
          onChange={(e) => setEmail(e.target.value)}
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
          disabled={isLocked}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {attempts >= 2 && (
          <ReCAPTCHA
            sitekey="6LdXCxMrAAAAAJJKMBasyoQRsWCgraEN_cM38dNm"
            ref={captchaRef}
            onChange={(value) => setCaptchaValue(value)}
          />
        )}

        <button
          type="submit"
          disabled={isLocked}
          style={{
            padding: "0.6rem",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            opacity: isLocked ? 0.6 : 1,
          }}
        >
          Login
        </button>

        <span
          onClick={() => navigate("/register")}
          style={{
            fontSize: "0.85rem",
            color: "#007bff",
            marginTop: "0.25rem",
            textAlign: "center",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          or register
        </span>

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