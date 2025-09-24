import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminPanel() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios.post("/api/check_admin.php", {
            token: token
        })
            .then(res => {
                console.log(res)
                if (!res.data.success) {
                    navigate("/login");
                } else {
                    setUser(res.data.user);
                    setLoading(false);
                }
            })
            .catch(err => {
                // Log del error completo
                console.log("Axios error:", err.response || err);
                navigate("/login");
            });
    }, [navigate]);

    if (loading) return <p>Verificando acceso...</p>;

    return (
        <div style={{ position: "relative", padding: "20px" }}>
            <button
                onClick={() => navigate("/")}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    border: "none",
                    background: "transparent",
                    fontSize: "20px",
                    cursor: "pointer"
                }}
            >
                ×
            </button>
            <h1>Bienvenido administrador</h1>
            <p>Esta es la sección exclusiva para usuarios con rol admin.</p>
            <h2>Guía de uso</h2>
            <ul>
                <li>Para eliminar productos de cualquier usuario, buscá el producto en la lupa.</li>
                <li>Cuando lo encuentres, hacé clic en el botón de la papelera.</li>
            </ul>
        </div>
    );
}
