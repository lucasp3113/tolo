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
  - En móvil, los dropdowns anidados no se cierran automáticamente para mejor UX.
*/

import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";

const Dropdown = ({
  direction = "d",
  text = "",
  options = [],
  size = 40,
  cnhamburger = "",
   isSubmenu = false,
  cndiv = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detecta si es móvil al montar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getDirectionConfig = () => {
    switch (direction) {
      case "l":
        return {
          styles: "right-full top-1/2 -translate-y-1/2",
          ArrowClosed: IoIosArrowBack,
        };
      case "r":
        return {
          styles: "left-full top-1/2 -translate-y-1/2",
          ArrowClosed: IoIosArrowForward,
        };
      case "u":
        return {
          styles: "left-1/2 -translate-x-1/2 bottom-full",
          ArrowClosed: IoIosArrowUp,
        };
      case "b":
      case "d":
      default:
        return {
          styles: "left-1/2 -translate-x-1/2 top-full",
          ArrowClosed: IoIosArrowUp,
        };
    }
  };

  const { styles, ArrowClosed } = getDirectionConfig();

  // Handlers distintos para móvil y PC
  const openMenu = () => !isMobile && setIsOpen(true);
  const closeMenu = () => !isMobile && setIsOpen(false);
  const toggleMenu = () => isMobile && setIsOpen(!isOpen);

  // Función para verificar si un elemento tiene dropdown anidado
  const hasNestedDropdown = (item) => {
    if (item.type === "custom" && item.content) {
      const contentString = item.content.toString();
      return (
        contentString.includes("Dropdown") ||
        (item.content.type && item.content.type.name === "Dropdown")
      );
    }
    return false;
  };

  return (
    <div
      className={`relative ${cndiv}`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        onClick={toggleMenu}
        className={`${
          text === ""
            ? "flex items-center justify-center cursor-pointer w-10 h-10"
            : "flex items-center px-4 py-2"
        } ${className}`}
      >
        {text === "" ? (
          <div className="relative">
            {/* Hamburguesa */}
            <RxHamburgerMenu
              size={size}
              className={`${cnhamburger} transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-0 rotate-180 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              style={{ fontSize: size || "24px" }}
            />
            {/* X */}
            <IoClose
              size={size}
              className={`${cnhamburger} absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 rotate-180 scale-75"
              }`}
              style={{ fontSize: size || "24px" }}
            />
          </div>
        ) : (
          <>
            <span>{text}</span>
            <div className="relative ml-2 mt-1">
              {/* Flecha cerrado (dirección específica) */}
              <ArrowClosed
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "opacity-0 rotate-180 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              {/* Flecha abierto (siempre hacia abajo) */}
              <IoIosArrowDown
                className={`absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-180 scale-75"
                }`}
              />
            </div>
          </>
        )}
      </button>

      <ul
        className={`absolute ${styles} z-50 w-auto min-w-max bg-white text-gray-800 shadow-lg rounded-md overflow-visible transition-all duration-300 ease-in-out whitespace-nowrap ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (item.onClick) item.onClick();
              if (item.to) navigate(item.to);

              // En móvil, solo cerrar si NO es un dropdown anidado
              if (isMobile && !hasNestedDropdown(item)) {
                setIsOpen(true);
              }
            }}
            className={`py-2 px-4 transition-all duration-200 ease-in-out transform select-none whitespace-nowrap ${
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
