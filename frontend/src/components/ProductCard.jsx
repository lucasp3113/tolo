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

export default function ProductCard({ name, price, image, stock, freeShipping }) {
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
    <div className="w-60 m-5 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative w-full">
        {/* Imagen del producto */}
        <img
          src={image}
          alt={name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{name}</h2>
        <p className="text-xl font-bold text-gray-900 mt-2">${price}</p>

        {freeShipping && (
          <p className="text-green-500 text-sm font-medium mt-1">Envío gratis</p>
        )}

        <p className={`text-sm font-medium mt-1 ${stockColor}`}>{stockMessage}</p>
      </div>
    </div>
  );
}
