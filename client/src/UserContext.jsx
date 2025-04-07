// client/src/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload?.name) {
          setUserName(decodedPayload.name);
        }
      } catch (err) {
        console.error("Token decode failed", err);
      }
    }
  }, []);

  const login = (name, token) => {
    console.log("Setting userName to:", name);
    localStorage.setItem("token", token);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserName(null);
  };

  return (
    <UserContext.Provider value={{ userName, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
