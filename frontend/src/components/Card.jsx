/*
📦 Card — Contenedor visual reutilizable con estilos base
   (fondo blanco, sombra, padding).

🧩 Uso:
   Agrupa y presenta contenido de forma ordenada y consistente.

🔧 Props:
  - children: contenido que se mostrará dentro del Card.
  - className: clases Tailwind adicionales para personalización.
*/


import React from 'react';

export default function Card({ children, className }) {
  return (
    <div className={`rounded-lg shadow p-4 bg-white ${className || ''}`}>
      {children}
    </div>
  );
}
