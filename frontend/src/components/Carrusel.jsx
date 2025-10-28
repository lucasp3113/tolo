import React, { useState, useRef, useEffect } from 'react';

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
  showArrows = false,
  multiple = false
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

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (multiple && slideImages.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [multiple, slideImages.length]);


  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

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

  const getSlidePosition = (index) => {
    const diff = index - currentSlide;
    const total = slideImages.length;

    let distance = diff;
    if (Math.abs(diff) > total / 2) {
      distance = diff > 0 ? diff - total : diff + total;
    }

    return distance;
  };

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });

  const getSlideStyle = (index) => {
    const position = getSlidePosition(index);

    const isCenter = position === 0;
    const scale = isCenter ? 1 : width >= 500 ? 0.85 : 0.85;
    const opacity = isCenter ? 1 : width >= 500 ? 0.6 : 0;
    const zIndex = isCenter ? 10 : 1;

    if (width >= 500) {
      let leftPosition;
      if (position === 0) {
        leftPosition = 25;
      } else if (position === -1) {
        leftPosition = 2;
      } else {
        leftPosition = 65;
      }

      return {
        left: `${leftPosition}%`,
        transform: `scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        transition: isTransitioning ? 'all 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
      };
    } else {
      const offset = width >= 500 ? 30 : 20; 

      return {
        transform: `translateX(${position * offset}%) scale(${scale})`,
        transform: `scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        transition: isTransitioning ? 'all 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
      };
    }
  }

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
      <div className={`${home ? "h-80 md:h-100  md:scale-90" : "h-96"} relative rounded-md overflow-hidden group`}>
        {!multiple ? (
          <div
            ref={slideRef}
            className="flex h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitioning ? 'transform 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {slideImages.map((image, index) => (
              <div key={index} className={`${className}  max-w-screen flex-shrink-0 relative flex items-center justify-center`}>
                {!imageError[index] ? (
                  <img
                    src={image}
                    loading='lazy'
                    alt={`Slide ${index + 1}`}
                    className="max-w-full max-h-full object-contain "
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
        ) : (
          <div className="relative w-full h-full flex items-center justify-center px-4">
            {slideImages.map((image, index) => {
              const position = getSlidePosition(index);
              if (Math.abs(position) > 1) return null;

              const isCenter = position === 0;

              return (
                <div
                  key={index}
                  className="absolute flex items-center justify-center"
                  style={{
                    width: isCenter ? width >= 500 ? '50%' : '60%' : '33.333%',
                    height: isCenter ? '100%' : '80%',
                    ...getSlideStyle(index)
                  }}
                >
                  {!imageError[index] ? (
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <p>Error</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {slideImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-lg z-20
              ${showArrows ? '' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-lg z-20
              ${showArrows ? '' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {slideImages.length > 1 && (
        <div className={`flex justify-center space-x-2 py-4 ${home ? "bg-transparent" : "bg-gray-50"}`}>
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full hover:scale-125 ${index === currentSlide
                ? 'bg-blue-500 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
              style={{
                transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;