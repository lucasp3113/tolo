 /*
🔘 Button — Botón interactivo con soporte para tamaños, colores y animaciones al hacer hover

🧩 Uso:
   Se utiliza para renderizar un botón personalizable que ejecuta una acción al hacer clic. 
   Admite múltiples colores y tamaños predefinidos, y cuenta con animación de escala 
   al pasar el cursor. Ideal para formularios, acciones destacadas o navegación.

🔧 Props:
  - onClick: función que se ejecuta al hacer clic en el botón.
  - color: cadena que define el color del botón. Valores posibles:
      • green, red, yellow, blue, purple, sky, black
  - size: cadena que define el tamaño del botón. Valores posibles:
      • sm (pequeño), md (mediano), lg (grande)
  - text: texto que se muestra dentro del botón.

📌 Ejemplo de uso:

<Button 
  onClick={() => alert("Botón clickeado")}
  color="green"
  size="md"
  text="Confirmar"
/>
*/

 
 import React from "react";

export default function Button({
  onClick,
  color,
  size,
  text,
  className,
  type = "submit",
  theme = "light" // agregamos theme por defecto
}) {

  const themes = {
    light: "text-white",
    dark: "text-black",
    blue: "text-blue-500"
  }

  const colors = {
    green: "bg-green-600",
    red: "bg-red-400",
    yellow: "bg-amber-600",
    blue: "bg-sky-800",
    purple: "bg-purple-800",
    sky: "bg-blue-500",
    black: "bg-gray-900"
  };

  const sizes = {
    sm: "p-1 text-sm",
    md: "p-2 text-sm",
    lg: "p-2 text-md"
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        ${colors[color] || "bg-gray-800"}
        ${sizes[size] || "p-1 text-sm"}
        rounded-xl
        ${themes[theme] || "text-white"}
        transition
        duration-300
        cursor-pointer
        text-white
        transform
        m-2
        shadow
        ${className || ""}
      `}
    >
      {text}
    </button>
  );
}
