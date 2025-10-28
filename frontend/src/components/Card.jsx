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

export default function Card({ children, className = "" }) {
    return (
        <div 
            className={`${className} card-component shadow-xl bg-white rounded-xl p-6 `}
            style={{
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
            }}
        >
            {children}
        </div>
    );
}