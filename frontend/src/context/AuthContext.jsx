import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Provider para envolver la app y dar acceso al contexto
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Chequea expiración del token en localStorage
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

  // Función para loguear (guardar token + expiración)
  function login(token, expiration) {
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiration", expiration);
    setIsLoggedIn(true);
  }

  // Función para desloguear
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
