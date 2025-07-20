/*
🗂️ Menu — Lista horizontal de elementos interactivos con iconos, animaciones y texto expandible

🧩 Uso:
   Se utiliza para mostrar un conjunto de opciones o enlaces en forma horizontal, 
   con soporte para animaciones visuales al pasar el cursor (hover) y expansión de texto 
   junto a los iconos. Ideal para menús de navegación en cabeceras o barras superiores.

🔧 Props:
  - elements: arreglo de objetos que representan cada elemento del menú. Cada objeto debe tener:
      • title: texto que se muestra.
      • icon: objeto con:
          - name: componente React que renderiza el ícono.
          - expand: booleano que controla si el texto se expande al hacer hover.
      • animation: booleano para activar efectos de escala y subrayado al pasar el mouse.
      • onClick : función que se ejecuta cuando se hace clic en el elemento.

📌 Ejemplo de uso:

<Menu
  elements={[
    {
      title: "Inicio",
      icon: { name: <FaHome />, expand: true },
      animation: false,
      onClick: () => console.log("Inicio clickeado")
    }
  ]}
/>
*/



import React from 'react';

export default function Menu({elements, model3d}) {
    return (
            <ul className="m-3 flex items-center justify-between">
                {elements.map((element, index) => (
                    <li onClick={element.onClick}
                        className={`group text-white cursor-pointer flex items-center m-3 
                        ${element.animation
                                ? "relative leading-none transition-transform duration-300 hover:scale-110 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[3px] after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-700 hover:after:w-full"
                                : ""
                            }`}
                        key={index}
                    >
                        <span
                            className={`${element.icon.expand
                                ? "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:sm:max-w-[100px] group-hover:md:max-w-[150px] group-hover:lg:max-w-[200px] transition-all duration-900 ease-in-out whitespace-nowrap inline-block font-[Montserrat,sans-serif] m-2 sm:text-[8px] md:text-[20px] lg:text-[20px]"
                                : ""
                                } group-hover:inline-block font-[Montserrat,sans-serif] m-2 sm:text-[8px] md:text-[20px] lg:text-[20px]`}
                        >
                            {element.title}
                        </span>
                        {element.icon.name}
                    </li>
                ))}
            {model3d ? model3d : undefined}
            </ul>
    );
}
