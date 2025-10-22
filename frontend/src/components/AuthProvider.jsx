import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(); 

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const expiration = localStorage.getItem("token_expiration");
    const now = Math.floor(Date.now() / 1000);

    if (expiration && now < parseInt(expiration)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      setIsLoggedIn(false);
    }
  }, []);

  function login(token, expiration) {
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiration", expiration);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
