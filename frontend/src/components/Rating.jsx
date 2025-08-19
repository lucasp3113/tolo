import { useState } from 'react';

export default function Rating({
  maxStars = 5,
  initialRating = 3.5,
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

  const handleStarClick = (event, starIndex) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const clickedHalf = clickX < width / 2 ? 0.5 : 1;

    const newRating = starIndex + clickedHalf;
    setRating(newRating);
    onRatingChange(newRating);
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
    const current = hoverRating || rating;

    if (starIndex + 1 <= current) return '100%';
    if (starIndex + 0.5 <= current) return '50%';
    return '0%';
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }, (_, index) => {
          const fillPercent = getStarFill(index);

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
                <linearGradient id={`starGradient-${index}`}>
                  <stop offset={fillPercent} stopColor="#facc15" />
                  <stop offset={fillPercent} stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#starGradient-${index})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating} / {maxStars}
        </span>
      )}
    </div>
  );
}
