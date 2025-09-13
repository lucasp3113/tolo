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
        <div>
            <h1 className="text-xl font-bold mb-4">
                Panel de Administración {user && `- Bienvenido ${user}`}
            </h1>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate("/productos")}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Gestión de Productos
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
