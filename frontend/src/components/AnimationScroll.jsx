import React, { useState, useEffect, useRef } from 'react';

const AnimationScroll = ({ children, className = '', threshold = 0.1, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calcular si el elemento está visible (con threshold para mejor control)
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const triggerPoint = windowHeight * (1 - threshold);
      
      const elementVisible = elementTop < triggerPoint && elementBottom > 0;
      
      if (scrollingDown) {
        // Animar cuando scrollea hacia abajo y el elemento entra
        if (elementVisible && !isVisible) {
          setIsVisible(true);
        }
      } else {
        // Resetear cuando scrollea hacia arriba y el elemento sale completamente
        if (elementTop > windowHeight && isVisible) {
          setIsVisible(false);
        }
      }
      
      lastScrollY = currentScrollY;
    };

    // Verificar visibilidad inicial
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * (1 - threshold);
    
    if (rect.top < triggerPoint && rect.bottom > 0) {
      setIsVisible(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, threshold]);

  return (
    <div
      ref={elementRef}
      className={`transition-all w-full flex items-center justify-center 
         duration-700 ease-in-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimationScroll;