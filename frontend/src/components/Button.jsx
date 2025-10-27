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
  text,
  className,
  type = "submit"
  }) {

  const colors = {
    white: "bg-white",
    green: "bg-green-600",
    red: "bg-red-400",
    yellow: "bg-amber-600",
    blue: "bg-sky-800",
    purple: "bg-purple-500",
    sky: "bg-sky-500",
    black: "bg-gray-900",
    transparent: "bg-transparent"
  };

   const sizes = {
     sm: "p-1 text-sm",
     md:"p-2 text-sm",
     lg: "p-2 text-md"
   };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        ${colors[color]}
        ${sizes[size] || "sm"}
        text-lg
        text-white
        rounded-xl
        font-quicksand
        font-semibold
        hover:scale-110
        transition-transform
        duration-200
        cursor-pointer
        m-2
        shadow
        ${className}
      `}>
      {text}
    </button>
  );
}
