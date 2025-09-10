import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost/tolo/backend/check_admin.php", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();

        if (!data.success) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <p>Verificando acceso...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Panel de Administración</h1>
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

