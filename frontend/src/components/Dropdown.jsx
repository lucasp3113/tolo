/*
🍔 Dropdown — Menú desplegable interactivo con soporte para navegación, contenido personalizado, y sub-menús

🧩 Uso:
   Se utiliza para renderizar un botón que despliega un menú de opciones al pasar el mouse por encima.
   Soporta navegación por rutas, ejecución de funciones, inputs personalizados y sub-dropdowns.
   Ideal para navegación, ajustes de usuario, filtros o menús contextuales.

🔧 Props:
  - hoverActivation: (boolean) si es true, se despliega con hover; si es false, solo con click. Por defecto: true.
  - border: (boolean) si es true, activa modo especial con input numérico y border. Por defecto: false.
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
  - showSelectedAsTitle: (boolean) si es true, muestra la opción seleccionada como título del dropdown
  - defaultSelectedIndex: (number) índice de la opción que se selecciona por defecto (opcional)
  - onSelectionChange: (function) callback que se ejecuta cuando cambia la selección (opcional)
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

3️⃣ Con selección que cambia el título:

<Dropdown
  text="Selecciona una opción"
  showSelectedAsTitle={true}
  options={[
    { label: "Opción 1", onClick: () => console.log("Opción 1") },
    { label: "Opción 2", onClick: () => console.log("Opción 2") },
    { label: "Opción 3", onClick: () => console.log("Opción 3") },
  ]}
  onSelectionChange={(selectedOption) => console.log("Seleccionado:", selectedOption)}
/>

4️⃣ Con opción por defecto preseleccionada:

<Dropdown
  text="Selecciona una opción"
  showSelectedAsTitle={true}
  defaultSelectedIndex={1} // Preselecciona "Opción 2"
  options={[
    { label: "Opción 1", onClick: () => console.log("Opción 1") },
    { label: "Opción 2", onClick: () => console.log("Opción 2") },
    { label: "Opción 3", onClick: () => console.log("Opción 3") },
  ]}
  onSelectionChange={(selectedOption) => console.log("Seleccionado:", selectedOption)}
/>

5️⃣ Con input o sub-dropdown:

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

6️⃣ Solo activación por click:

<Dropdown
  text="Solo Click"
  hoverActivation={false}
  options={[
    { label: "Opción 1", onClick: () => console.log("Opción 1") },
    { label: "Opción 2", onClick: () => console.log("Opción 2") },
  ]}
/>

7️⃣ Modo border con input numérico:

<Dropdown
  text="Número"
  border={true}
  defaultSelectedIndex={0}
  showSelectedAsTitle={true}
  options={[
    { label: "10", onClick: () => console.log("10") },
    { label: "50", onClick: () => console.log("50") },
    { label: "100", onClick: () => console.log("100") },
    { label: "200", onClick: () => console.log("200") },
  ]}
/>

🧠 Tip:
  - Se abre al pasar el mouse por encima (si hoverActivation=true) o solo con click (si hoverActivation=false).
  - Las opciones con `type: "custom"` permiten insertar cualquier componente de React.
  - El submenú también se despliega al pasar el mouse (ideal para menús multinivel).
  - En móvil, los dropdowns anidados no se cierran automáticamente para mejor UX.
  - Cuando `showSelectedAsTitle` es true, el título cambia al seleccionar una opción.
  - `defaultSelectedIndex` permite preseleccionar una opción al montar el componente.
  - Con `border={true}` se activa el modo especial con input numérico (rango 1-200) y opciones del mismo ancho.
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
  hoverActivation = true,
  border = false,
  direction = "d",
  text = "",
  options = [],
  size = 40,
  cnhamburger = "",
  isSubmenu = false,
  cndiv = "",
  className = "",
  showSelectedAsTitle = false,
  defaultSelectedIndex = null,
  onSelectionChange = null,
  max = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Funciones para inicializar el estado con la opción por defecto
  const getInitialSelectedOption = () => {
    if (defaultSelectedIndex !== null && options[defaultSelectedIndex]) {
      const defaultOption = options[defaultSelectedIndex];
      if (defaultOption.type !== "custom" && defaultOption.label) {
        return defaultOption;
      }
    }
    return null;
  };

  const getInitialDisplayText = () => {
    const initialOption = getInitialSelectedOption();
    if ((showSelectedAsTitle || border) && initialOption) {
      return initialOption.label;
    }
    return text;
  };

  const [selectedOption, setSelectedOption] = useState(getInitialSelectedOption());
  const [displayText, setDisplayText] = useState(getInitialDisplayText());
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

  // Función para cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.dropdown-container')) {
        setIsOpen(false);
        // Si estamos en modo border, validar el valor del input
        if (border) {
          const currentValue = inputValue || "1"; // Si está vacío, usar "1"
          const validatedValue = validateAndCorrectValue(currentValue);
          setInputValue(validatedValue.toString());
          setDisplayText(validatedValue.toString());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, border, inputValue]);

  // Ejecutar callback inicial si hay opción por defecto
  useEffect(() => {
    const initialOption = getInitialSelectedOption();
    if (initialOption && onSelectionChange) {
      onSelectionChange(initialOption);
    }
  }, []); // Solo se ejecuta una vez al montar

  // Establecer opción por defecto si cambian las opciones
  useEffect(() => {
    if (defaultSelectedIndex !== null && options[defaultSelectedIndex]) {
      const defaultOption = options[defaultSelectedIndex];
      if (defaultOption.type !== "custom" && defaultOption.label) {
        setSelectedOption(defaultOption);
        if (showSelectedAsTitle || border) {
          setDisplayText(defaultOption.label);
        }
        
        // Ejecutar callback si existe
        if (onSelectionChange) {
          onSelectionChange(defaultOption);
        }
      }
    }
  }, [showSelectedAsTitle, border, defaultSelectedIndex, options, onSelectionChange]);

  // Actualiza el texto mostrado cuando cambia el texto inicial
  useEffect(() => {
    if ((!showSelectedAsTitle && !border) || !selectedOption) {
      setDisplayText(text);
    }
  }, [text, showSelectedAsTitle, border, selectedOption]);

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

  // Handlers distintos para móvil y PC con soporte para hoverActivation
  const openMenu = () => !isMobile && hoverActivation && setIsOpen(true);
  const closeMenu = () => !isMobile && hoverActivation && setIsOpen(false);
  const toggleMenu = () => (isMobile || !hoverActivation) && setIsOpen(!isOpen);

  // Función para validar y corregir valores (min: 1, max: 200)
  const validateAndCorrectValue = (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) return 1;
    if (num > 200) return 200;
    return num;
  };

  // Función para validar si un número está en el rango válido (solo para border mode)
  const isValidNumber = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1 && num <= 200;
  };

  // Handler para cambio en el input (solo para border mode)
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Prevenir que se ingrese más de 3 dígitos (para evitar números > 200)
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    
    // Convertir a número y validar rango
    const num = parseInt(value);
    if (value !== "" && (!isNaN(num) && num > max)) {
      value = max;
    }
    
    setInputValue(value);
    
    // Si es un número válido en rango, actualizar el display text
    if (border && value && isValidNumber(value)) {
      setDisplayText(value);
    }
  };

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

  // Función para manejar la selección de opciones
  const handleOptionSelect = (item, index) => {
    // 1. setDisplayText(item.label) SIEMPRE se ejecuta para opciones normales
    if (item.label && item.type !== "custom") {
      setDisplayText(item.label);
      // Si estamos en modo border, también actualizar el inputValue
      if (border) {
        setInputValue(item.label);
      }
    }

    // 2. selectedOption y onSelectionChange SOLO si showSelectedAsTitle está activo
    if (showSelectedAsTitle && item.label && item.type !== "custom") {
      setSelectedOption(item);
      
      // Ejecutar callback si existe
      if (onSelectionChange) {
        onSelectionChange(item);
      }
    }

    // Ejecutar la acción de la opción
    if (item.onClick) item.onClick();
    if (item.to) navigate(item.to);

    // En móvil, solo cerrar si NO es un dropdown anidado
    if (isMobile && !hasNestedDropdown(item)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`relative dropdown-container ${cndiv}`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {border ? (
        <div 
          className={`flex items-center justify-between border border-gray-300 rounded px-3 py-2 ${className}`}
        >
          <input
            type="number"
            min="1"
            max="999"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="1"
            className="flex-1 outline-none bg-transparent min-w-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              // Prevenir teclas que puedan causar valores inválidos
              if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                e.preventDefault();
              }
            }}
          />
          <button
            type="button"
            onClick={toggleMenu}
            className="flex items-center justify-center ml-2 cursor-pointer"
          >
            <div className="relative">
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
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleMenu}
          className={`${
            displayText === ""
              ? "flex items-center justify-center cursor-pointer w-10 h-10"
              : "flex items-center px-4 py-2"
          } ${className}`}
        >
          {displayText === "" ? (
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
              <span>{displayText}</span>
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
      )}

      <ul
        className={`absolute ${styles} z-50 bg-white text-gray-800 shadow-lg rounded-md overflow-visible transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ 
          width: border ? 'calc(100% + 0px)' : 'auto',
          minWidth: border ? 'auto' : 'max-content'
        }}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionSelect(item, index);
            }}
            className={`py-2 px-4 transition-all duration-200 ease-in-out transform select-none ${
              border ? '' : 'whitespace-nowrap'
            } ${
              item.type === "custom"
                ? "cursor-default hover:bg-transparent"
                : "cursor-pointer hover:bg-gray-200 hover:scale-105"
            } ${
              (showSelectedAsTitle || border) && selectedOption?.label === item.label
                ? "bg-blue-100 text-blue-700"
                : ""
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