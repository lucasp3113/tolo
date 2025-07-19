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

export default function Button ({
  onClick,
  color, 
  size, 
  text
  }) {

  const colors = {
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-amber-600",
    blue: "bg-sky-800",
    purple: "bg-purple-800",
    sky: "bg-sky-500",
    black: "bg-gray-900"
  };

   const sizes = {
     sm: "px-3 py-1 text-sm",
     md:"px-4 py-2 text-base",
     lg: "px-5 py-3 text-lg"
   };

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color] || "bg-gray-900"}
        ${sizes[size] || "sm"}
        text-lg
        text-white
        rounded-lg
        p-3
        flex-initial
        hover:scale-110
        transition
        duration-300
        cursor-pointer
        transform
        m-2
        shadow-2xl
      `}>
      {text}
    </button>
  );
}
