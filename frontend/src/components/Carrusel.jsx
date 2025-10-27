import React, { useState, useRef } from 'react';

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
  home = null,
  images = [],
  className = "",
  draggable = false,
  showArrows = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState({});
  const [dragStartX, setDragStartX] = useState(null);
  const [dragging, setDragging] = useState(false);

  const slideRef = useRef();

  const defaultImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
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

  // 🔁 Drag handlers
  const handleMouseDown = (e) => {
    if (!draggable) return;
    setDragStartX(e.clientX);
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!draggable || !dragging) return;
    const dragDistance = e.clientX - dragStartX;
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setDragging(false);
    }
  };

  const handleMouseUp = () => {
    if (!draggable) return;
    setDragging(false);
  };

  const handleMouseLeave = () => {
    if (!draggable) return;
    setDragging(false);
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
    <div className={`relative ${home ? "bg-transparent" : "bg-white"} overflow-hidden ${className}`}>
      {/* Contenedor principal del carrusel */}
      <div className={`${home ? "h-66" : "h-96"} relative rounded-md overflow-hidden group`}>

        {/* Slides */}
        <div
          ref={slideRef}
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {slideImages.map((image, index) => (
            <div key={index} className={`${className} w-full flex-shrink-0 relative flex items-center justify-center`}>
              {!imageError[index] ? (
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={() => handleImageError(index)}
                  style={{ backgroundColor: 'transparent' }}
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
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-lg z-10
              ${showArrows ? '' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-lg z-10
              ${showArrows ? '' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        
      </div>

      {/* Indicadores de puntos */}
      {slideImages.length > 1 && (
        <div className={`flex justify-center space-x-2 py-4 ${home ? "bg-transparent" : "bg-gray-50"}`}>
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