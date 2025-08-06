import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  // Si no está autenticado, redirige al login
  useEffect(() => {
    if (localStorage.getItem("auth") !== "true") {
      navigate("/login");
    }
  }, []);

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/productos")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Gestión de Productos
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
/*
  AdminPanel.jsx

  Este componente es el panel principal del administrador.

  🔹 Qué hace:
    - Verifica si el usuario está autenticado (buscando "auth" en localStorage).
      Si no está logueado, redirige automáticamente a /login.
    
    - Muestra opciones para el administrador:
        1. "Gestión de Productos" → lleva a Product.jsx (/productos)
        2. "Cerrar Sesión" → borra la sesión (auth en localStorage) y vuelve al login
    
    - Está protegido con un useEffect que ejecuta la validación
      apenas se carga el componente.
    
    - Estilizado con Tailwind CSS para mantenerlo limpio y funcional.
*/