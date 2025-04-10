import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useUser, UserProvider } from "./UserContext";
import Login from "./login";
import Schedule from "./Schedule";
import Home from "./Home";
import "./App.css";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard"; 
import UserDashboard from './UserDashboard';

function AppContent() {
  const { userName, logout } = useUser();
  const isAdmin = Boolean(localStorage.getItem("adminToken"));

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

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          {userName && !isAdmin && (
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              My Appointments
            </NavLink>
          )}

          {userName ? (
            <>
              <span style={{ color: "black", fontFamily: "Great Vibes" }}>
                Welcome, {userName}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                  fontFamily: "'Great Vibes', cursive",
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
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
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