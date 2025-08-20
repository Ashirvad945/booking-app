import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, role: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) setAuth({ token, role });
  }, []);

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setAuth({ token, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
