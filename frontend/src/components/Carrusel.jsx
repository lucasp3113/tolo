import React from 'react';
import carruseluno from '../assets/carrusel1'

export default function Carrusel() {

  return (
    <div className="w-80 mx-auto text-center">
      <div className="relative">
        <img
          src={carruseluno}
          alt="slide"
          className="w-full rounded-lg"
        />
        <button
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
          aria-label="Previous Slide"
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
          aria-label="Next Slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}
