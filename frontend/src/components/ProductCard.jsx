/*
  Este componente ProductCard muestra una tarjeta individual de un producto.
  Recibe las props:
    - name: nombre del producto
    - price: precio del producto
    - image: imagen del producto
    - stock: cantidad de stock disponible
    - freeShipping: booleano si tiene envío gratis

  Qué hace:
  - Muestra la imagen del producto en la parte superior.
  - Abajo muestra el nombre y el precio.
  - Si tiene envío gratis, aparece un texto verde que lo indica.
  - Según el stock, muestra un mensaje:
      0           -> "Sin stock" en rojo
      1-10        -> "¡Quedan pocos!" en naranja
      11-100      -> "Disponible" en verde
      +100        -> "+ de 100 disponibles" en verde oscuro
  - La tarjeta tiene estilos con Tailwind para verse limpia, con sombra y
    efecto hover, y es responsive porque la imagen cambia de tamaño
    según el tamaño de la pantalla.
*/

import React from "react";
import Button from "./Button";


export default function ProductCard({ name, price, image, stock, freeShipping, phone = false }) {
  let stockMessage = "";
  let stockColor = "";
  if (stock === 0) {
    stockMessage = "Sin stock";
    stockColor = "text-red-500";
  } else if (stock <= 10) {
    stockMessage = "¡Quedan pocos!";
    stockColor = "text-orange-500";
  } else if (stock <= 100) {
    stockMessage = "Disponible";
    stockColor = "text-green-500";
  } else {
    stockMessage = "+ de 100 disponibles";
    stockColor = "text-green-600";
  }

  return (
    <div className={`rounded-lg cursor-pointer relative p-2 bg-white shadow overflow-hidden flex items-center justify-center  ${phone ? "w-full mb-2 m-0 " : "h-96 w-56 flex-col m-8 hover:shadow-lg/20 transition-shadow"}`}>
        <img
          src={image}
          alt={name}
          className="w-44 h-full sm:h-full md:h-full object-cover"
        />

      <div className="p-4 flex flex-col w-full items-center justify-center">
        <h2 className="text-xl m-1 font-semibold text-gray-800 line-clamp-2">{name}</h2>
        <p className="text-xl m-1 font-bold text-gray-900 mt-2">${price}</p>

        {freeShipping && (
          <p className="text-green-500 m-1 text-sm font-medium mt-1">Envío gratis</p>
        )}
        <p className={`text-sm font-medium m-1 ${stockColor}`}>{stockMessage}</p>
      </div>
    </div>
  );
}
