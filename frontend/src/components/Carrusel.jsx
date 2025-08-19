import React, { useState, useEffect } from 'react';

// Iconos SVG personalizados
const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Carousel = ({ 
  images = [], 
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState({});

  // Imágenes por defecto si no se pasan ninguna
  const defaultImages = [
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-c3e6ab399fffacdff996c87aeceb685f_68240bb2aeaff.jpg?1747192754",
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-584a760c2c72381cafd3b187532d1b52_5b10b2291708e.png?1527820841",
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-7a0bd7c76f352c1de526ca4e2908d2cb_664753a528393.jpeg?1715950532",
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-621f71033d4070fb7087fa836f1b4e6f_5f91c6393dda2.jpg?1603388985",
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-2e02580acaf44ad5e88475f9217fd3d2_6838c8938d67b.jpg?1748551827",
    "https://asset-cdn.schoology.com/system/files/imagecache/profile_reg/pictures/picture-e8cb653f617b28f06e6d8f86dd22ae3f_66e8dbe8d46f9.jpg?1726536680",
  ];

  const slideImages = images.length > 0 ? images : defaultImages;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  if (slideImages.length === 0) {
    return (
      <div className={`relative bg-gray-200 rounded-xl overflow-hidden ${className}`}>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <p>No hay imágenes para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Contenedor principal del carrusel */}
      <div className="relative h-96 overflow-hidden group">
        {/* Slides */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slideImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              {/* Imagen */}
              {!imageError[index] ? (
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Error al cargar imagen</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        {slideImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Contador de imágenes */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
          {currentSlide + 1} / {slideImages.length}
        </div>
      </div>

      {/* Indicadores de puntos */}
      {slideImages.length > 1 && (
        <div className="flex justify-center space-x-2 py-4 bg-gray-50">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;