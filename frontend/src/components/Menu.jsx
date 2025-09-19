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
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


export default function Menu({ elements, model3d, className = "" }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [windowWidth])
    const [selected, setSelected] = useState(null)
    const location = useLocation()
    useEffect(() => {
        const foundIndex = elements.findIndex(elements => elements.url === location.pathname);
        if (foundIndex !== -1) {
            setSelected(foundIndex);
        }
    }, [location.pathname, elements]);


    return (
        <ul className={`m-3 flex items-center justify-between ${className}`}>
            {elements.map((element, index) => (
                <li onClick={element.onClick}
                    className={` group text-white cursor-pointer flex items-center ${elements.length === 3 ? windowWidth < 500 ? "m-8" : "m-2" : windowWidth < 500 ? "m-4" : "m-2"} 
                        ${element.animation
                            ? "relative leading-none transition-transform duration-300 hover:scale-110 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[3px] after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-700 hover:after:w-full"
                            : ""
                        }`}
                    key={index}
                >
                    <span
                        className={`${element.icon.expand
                            ? "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:sm:max-w-[100px] group-hover:md:max-w-[150px] group-hover:lg:max-w-[200px] transition-all duration-900 ease-in-out whitespace-nowrap inline-block font-[Montserrat,sans-serif] m-1 sm:text-[8px] md:text-[20px] lg:text-[20px]"
                            : ""
                            } group-hover:inline-block font-[Montserrat,sans-serif] m-2 sm:text-[8px] md:text-[20px] lg:text-[20px]`}
                    >
                        {element.title}
                    </span>
                    <div className="flex flex-col items-center h-full justify-center">
                        {React.cloneElement(
                            element.icon.name,
                            {
                                className: `${element.icon.name.props.className || ""} ${selected === index ? "scale-140 mb-" : undefined}`,
                                onClick: () => element.onClick && windowWidth < 500 ? setSelected(index) : undefined

                            }
                        )}
                        {selected === index ? <span className='absolute translate-y-7 font-mono text-xs tracking-tighter font-
 '>{element.title}</span> : undefined}
                    </div>


                </li>
            ))}
            {model3d?.map((model, index) => (
                <li key={`model3d-${index}`}>
                    {model}
                </li>
            ))}
        </ul>
    );
}