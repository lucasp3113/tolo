/*
🍔 Dropdown — Menú desplegable interactivo con soporte para navegación, contenido personalizado, y sub-menús

🧩 Uso:
   Se utiliza para renderizar un botón que despliega un menú de opciones al pasar el mouse por encima.
   Soporta navegación por rutas, ejecución de funciones, inputs personalizados y sub-dropdowns.
   Ideal para navegación, ajustes de usuario, filtros o menús contextuales.

🔧 Props:
  - text: (string) texto que se muestra en el botón. Si está vacío, se renderiza un ícono hamburguesa.
  - size: (string) tamaño del ícono (cuando `text` está vacío). Por defecto: "30".
  - direction: (string) dirección donde se abre el menú. Valores posibles:
      • "d" (abajo) – por defecto
      • "l" (izquierda)
      • "r" (derecha)
  - options: (array) lista de opciones del menú. Cada opción puede ser:
      • { label: string, to: string } → Navega a una ruta usando react-router
      • { label: string, onClick: function } → Ejecuta una función al hacer clic
      • { type: "custom", content: JSX.Element } → Inserta contenido personalizado (otro Dropdown, input, etc.)
  - className: (string) clases adicionales para estilizar el botón.
  - cnhamburger: (string) clases adicionales para el ícono hamburguesa.
  - cndiv: (string) clases adicionales para el contenedor principal.

📌 Ejemplos de uso:

1️⃣ Con navegación:

<Dropdown
  text="Menú"
  options={[
    { label: "Inicio", to: "/" },
    { label: "Perfil", to: "/perfil" },
  ]}
/>

2️⃣ Con función:

<Dropdown
  text="Opciones"
  options={[
    { label: "Cerrar sesión", onClick: () => logout() },
  ]}
/>

3️⃣ Con input o sub-dropdown:

<Dropdown
  text="Filtros"
  direction="d"
  options={[
    {
      type: "custom",
      content: (
        <Dropdown
          text="Categoría"
          direction="r"
          options={[
            { label: "Zapatos", to: "/zapatos" },
            { label: "Remeras", to: "/remeras" },
          ]}
        />
      )
    },
    {
      type: "custom",
      content: (
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full px-2 py-1 border border-gray-300 rounded"
        />
      )
    }
  ]}
/>

🧠 Tip:
  - Se abre al pasar el mouse por encima.
  - Las opciones con `type: "custom"` permiten insertar cualquier componente de React.
  - El submenú también se despliega al pasar el mouse (ideal para menús multinivel).
*/


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Dropdown = ({
  size = "30",
  text = "",
  options = [],
  className = "",
  cnhamburger = "",
  cndiv = "",
  direction = "d",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getDirectionStyles = () => {
    switch (direction) {
      case "l":
        return "right-full top-1/2 -translate-y-1/2";
      case "r":
        return "left-full top-1/2 -translate-y-1/2";
      case "d":
      default:
        return "left-1/2 -translate-x-1/2 top-full";
    }
  };

  return (
    <div
      className={`relative inline-block ${cndiv}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`${
          text === ""
            ? "flex items-center justify-center cursor-pointer"
            : "flex items-center px-4 py-2"
        } ${className}`}
      >
        {text === "" ? (
          <RxHamburgerMenu size={size} className={`${cnhamburger}`} />
        ) : (
          <>
            <span>{text}</span>
            <svg className="fill-current h-4 w-4 ml-2" viewBox="0 0 20 20">
              <path
                d="M5.25 7.75L10 12.5l4.75-4.75"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </>
        )}
      </button>

      <ul
        className={`absolute ${getDirectionStyles()} mt-1 z-50 w-auto min-w-max bg-white text-gray-800 shadow-lg rounded-md overflow-visible transition-all duration-300 ease-in-out whitespace-nowrap ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (item.onClick) item.onClick();
              if (item.to) navigate(item.to);
              setIsOpen(false);
            }}
            className={`py-2 px-4 transition-all duration-200 ease-in-out transform ${
              item.type === "custom"
                ? "cursor-default hover:bg-transparent"
                : "cursor-pointer hover:bg-gray-200 hover:scale-105"
            }`}
          >
            {item.type === "custom" ? item.content : item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
