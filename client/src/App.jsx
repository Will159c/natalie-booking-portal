// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useUser, UserProvider } from "./UserContext";
import Login from "./login";
import Schedule from "./Schedule";
import Home from "./Home";
import "./App.css";

function AppContent() {
  const { userName, logout } = useUser();
  console.log("Current userName:", userName);

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            fontWeight: "flex",
            fontSize: "3.8rem",
            fontFamily: "'Great Vibes', cursive",
          }}
        >
          Natalie Peck
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Schedule
          </NavLink>

          {userName ? (
            <>
              <span style={{ color: "blue", fontWeight: "bold" }}>
                Welcome, {userName}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
