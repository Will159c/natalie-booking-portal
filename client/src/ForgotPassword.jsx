import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedEmail || !isValidEmail) {
      setMessage("Please enter a valid email.");
      setIsSuccess(false);
      return;
    }
    

    if (!captchaToken) {
      setMessage("Please complete the CAPTCHA.");
      setIsSuccess(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, {
        email: trimmedEmail,
        captcha: captchaToken,
      });

      setMessage(res.data.message || "Check your email for a reset link.");
      setIsSuccess(true);
    } catch (err) {
      const status = err.response?.status;
      const fallback = "Something went wrong. Please try again.";

      if (status === 429) {
        setMessage(err.response.data.error || "Too many requests. Try again soon.");
      } else if (status === 404) {
        setMessage("No account found with that email.");
      } else {
        setMessage(err.response?.data?.error || fallback);
      }

      setIsSuccess(false);
    }

    setCooldown(60);
    captchaRef.current?.reset();
    setCaptchaToken(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "start", background: "#f9f9f9", paddingTop: "10vh" }}>
      <form
        onSubmit={handleSubmit}
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
        <h2 style={{ textAlign: "center", fontWeight: "500" }}>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={cooldown > 0}
          style={{
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: cooldown > 0 ? "#f0f0f0" : "white",
          }}
        />

        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={(token) => setCaptchaToken(token)}
          ref={captchaRef}
        />

        <button
          type="submit"
          disabled={cooldown > 0}
          style={{
            padding: "0.6rem",
            background: cooldown > 0 ? "#888" : "#333",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {cooldown > 0 ? `Wait ${cooldown}s...` : "Send Reset Link"}
        </button>

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

