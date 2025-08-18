import { useState } from 'react';

export default function Rating({ 
  maxStars = 5, 
  initialRating = 0, 
  onRatingChange = () => {}, 
  size = 'md',
  readonly = false,
  showValue = false,
  className
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const handleStarClick = (starIndex) => {
    if (readonly) return;
    
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleStarHover = (starIndex) => {
    if (readonly) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarClass = (starIndex) => {
    const currentRating = hoverRating || rating;
    const baseClasses = `${sizeClasses[size]} transition-all duration-200 ${
      readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
    }`;
    
    if (starIndex < currentRating) {
      return `${baseClasses} text-yellow-400 fill-current`;
    } else {
      return `${baseClasses} text-gray-300 hover:text-yellow-400`;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }, (_, index) => (
          <svg
            key={index}
            className={getStarClass(index)}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating} / {maxStars}
        </span>
      )}
    </div>
  );
}

// Ejemplo de uso del componente
function App() {
  const [currentRating, setCurrentRating] = useState(3);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Componente Rating
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating Interactivo</h3>
            <Rating 
              initialRating={currentRating}
              onRatingChange={setCurrentRating}
              showValue={true}
              size="lg"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Rating Solo Lectura</h3>
            <Rating 
              initialRating={4}
              readonly={true}
              showValue={true}
              size="md"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Rating Pequeño</h3>
            <Rating 
              initialRating={2}
              size="sm"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Rating Extra Grande</h3>
            <Rating 
              maxStars={10}
              initialRating={7}
              size="xl"
              showValue={true}
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Rating actual:</strong> {currentRating} estrellas
          </p>
        </div>
      </div>
    </div>
  );
}