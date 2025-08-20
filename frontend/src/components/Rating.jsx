import { useState, useEffect } from 'react';

export default function Rating({
  maxStars = 5,
  initialRating = 0,
  value, // Prop controlada desde afuera
  onRatingChange = () => {},
  size = 'md',
  readonly = false,
  showValue = true,
  className = '',
  onClick,
  id // ID único para cada rating
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // Si se pasa un valor controlado, usar ese en lugar del estado interno
  useEffect(() => {
    if (value !== undefined) {
      setRating(value);
    }
  }, [value]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const handleStarClick = (event, starIndex) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const clickedHalf = clickX < width / 2 ? 0.5 : 1;

    const newRating = starIndex + clickedHalf;
    
    // Solo actualizar estado interno si no es controlado
    if (value === undefined) {
      setRating(newRating);
    }
    
    onRatingChange(newRating, id); // Pasar el ID en el callback
  };

  const handleStarHover = (event, starIndex) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - left;
    const hoveredHalf = hoverX < width / 2 ? 0.5 : 1;

    setHoverRating(starIndex + hoveredHalf);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarFill = (starIndex) => {
    const current = hoverRating || (value !== undefined ? value : rating);

    if (starIndex + 1 <= current) return '100%';
    if (starIndex + 0.5 <= current) return '50%';
    return '0%';
  };

  const displayRating = value !== undefined ? value : rating;

  return (
    <div onClick={onClick} className={`flex items-center gap-1 ${className}`}>
      <div
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }, (_, index) => {
          const fillPercent = getStarFill(index);
          const uniqueId = `starGradient-${id || 'default'}-${index}`;

          return (
            <svg
              key={index}
              className={`${sizeClasses[size]} transition-all duration-200 ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
              onClick={(e) => handleStarClick(e, index)}
              onMouseMove={(e) => handleStarHover(e, index)}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={uniqueId}>
                  <stop offset={fillPercent} stopColor="#3884fc" />
                  <stop offset={fillPercent} stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${uniqueId})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-xl font-medium text-[#3884fc]">
          {displayRating}
        </span>
      )}
    </div>
  );
}

// Ejemplo de uso del componente
function App() {
  const [ratings, setRatings] = useState({
    product: 4.5,
    quality: 3,
    service: 5
  });

  const handleRatingChange = (newRating, ratingId) => {
    if (ratingId) {
      setRatings(prev => ({
        ...prev,
        [ratingId]: newRating
      }));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Rating con IDs Únicos
        </h2>
        
        <div className="space-y-4">
          {/* Rating del producto (controlado) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating del Producto</h3>
            <Rating 
              id="product"
              value={ratings.product}
              onRatingChange={handleRatingChange}
              showValue={true}
              size="lg"
            />
            <p className="text-sm text-gray-600">Valor: {ratings.product}</p>
          </div>

          {/* Rating de calidad (no controlado) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating de Calidad</h3>
            <Rating 
              id="quality"
              initialRating={3}
              onRatingChange={handleRatingChange}
              showValue={true}
              size="md"
            />
          </div>

          {/* Rating de servicio (solo lectura) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating de Servicio (Solo lectura)</h3>
            <Rating 
              id="service"
              value={ratings.service}
              readonly={true}
              showValue={true}
              size="md"
            />
          </div>

          {/* Rating promedio general */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating Promedio</h3>
            <Rating 
              id="average"
              value={(ratings.product + ratings.quality + ratings.service) / 3}
              readonly={true}
              showValue={true}
              size="sm"
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Ratings actuales:</strong>
          </p>
          <ul className="text-sm text-gray-600">
            <li>Producto: {ratings.product}</li>
            <li>Calidad: {ratings.quality}</li>
            <li>Servicio: {ratings.service}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}