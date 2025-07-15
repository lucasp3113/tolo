import React from 'react';
// This component is a simple card layout that can be used to wrap content.
export default function Card({ children, className }) {
  return (
    <div className={`rounded-lg shadow p-4 bg-white ${className || ''}`}>
      {children}
    </div>
  );
}
