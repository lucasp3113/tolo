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
            className={`card-component ${className}`}
            style={{
                backgroundColor: 'white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
            }}
        >
            {children}
        </div>
    );
}