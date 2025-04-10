import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import zxcvbn from "zxcvbn";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [strength, setStrength] = useState(0);
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordScore = zxcvbn(password).score;

    if (!name || !isEmailValid || !password || !confirmPassword) {
      setIsSuccess(false);
      setMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setIsSuccess(false);
      setMessage("Passwords do not match");
      return;
    }

    if (passwordScore < 2) {
      setIsSuccess(false);
      setMessage("Password is too weak");
      return;
    }

    if (!captchaValue) {
      setIsSuccess(false);
      setMessage("Please complete the CAPTCHA");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      setMessage("Account created! Please check your email to verify.");
      setIsSuccess(true);
      setShowResend(true);
    } catch (err) {
      setIsSuccess(false);
      setMessage("Invalid email");
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend`, { email });
      setMessage(res.data.message || "Verification email resent!");
      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(false);
      setMessage("Failed to resend verification email");
    }
  };

  const inputWrapper = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputStyle = {
    padding: "0.6rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
    paddingRight: "2.5rem",
  };

  const eyeStyle = {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    color: "#888",
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
        onSubmit={handleRegister}
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
        <h2 style={{ textAlign: "center", fontWeight: "500" }}>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "0.6rem",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxSizing: "border-box",
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
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxSizing: "border-box",
          }}
        />

        {/* Password input with toggle */}
        <div style={inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(zxcvbn(e.target.value).score);
            }}
            required
            style={inputStyle}
          />
          <div style={eyeStyle} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Strength Meter */}
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          Password Strength:{" "}
          <span
            style={{
              fontWeight: "bold",
              color: strength < 2 ? "red" : strength === 2 ? "orange" : "green",
            }}
          >
            {["Very Weak", "Weak", "Fair", "Good", "Strong"][strength]}
          </span>
        </div>

        {/* Confirm password input with toggle */}
        <div style={inputWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={eyeStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <ReCAPTCHA
          sitekey="6LdXCxMrAAAAAJJKMBasyoQRsWCgraEN_cM38dNm"
          ref={captchaRef}
          onChange={(value) => setCaptchaValue(value)}
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

        <span
          onClick={() => navigate("/login")}
          style={{
            fontSize: "0.85rem",
            color: "#007bff",
            marginTop: "0.25rem",
            textAlign: "center",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          or login
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

        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
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
      </form>
    </div>
  );
}