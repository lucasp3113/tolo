import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, deja pasar
  return children;
}
