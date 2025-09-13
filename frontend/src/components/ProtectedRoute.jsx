import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function RutaProtegida({ children }) {
  const [validando, setValidando] = useState(true);
  const [valido, setValido] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setValido(false);
      setValidando(false);
      return;
    }

    axios
      .post(`/api/verify_token.php?token=${token}`)
      .then(() => {
        setValido(true);
        setValidando(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setValido(false);
        setValidando(false);
      });
  }, []);

  if (validando) return null

  if (!valido) return <Navigate to="/login" replace />;

  return children;
}
