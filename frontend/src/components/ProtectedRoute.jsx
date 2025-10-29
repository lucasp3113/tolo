import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RutaProtegida({ children }) {
  const [validando, setValidando] = useState(true);
  const [valido, setValido] = useState(false);
  const {ecommerce} = useParams()
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setValido(false);
      setValidando(false);
      return;
    }

    axios
      .post(`/api/verify_token.php?token=${token}`)
      .then((res) => {
        setValido(true);
        setValidando(false);
        console.log(res)
      })
      .catch(() => {
        localStorage.removeItem("token");
        setValido(false);
        setValidando(false);
      });
  }, []);

  if (validando) return null

  if (!valido) return <Navigate to={ecommerce ? `/${ecommerce}/login/` : "/login"} replace />;

  return children;
}
