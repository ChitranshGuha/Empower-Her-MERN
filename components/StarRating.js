import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ initialRating = 0, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0); 
  const [clickedRating, setClickedRating] = useState(initialRating);

  const handleStarClick = (ratingValue) => {
    setClickedRating(ratingValue);
    if (onRatingChange) {
      onRatingChange(ratingValue);
    }
  };

  const handleStarHover = (ratingValue) => {
    setHoverRating(ratingValue);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="d-flex align-items-center" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <Star
          key={starValue}
          size={24}
          fill={starValue <= (hoverRating || clickedRating) ? '#FFD700' : 'none'}
          color="#FFD700" 
          className="me-1" 
          style={{ cursor: 'pointer', transition: 'fill 0.2s ease-in-out' }}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      ))}
      <span className="ms-2 text-muted small">
        {clickedRating > 0 ? `(${clickedRating}/5)` : ''}
      </span>
    </div>
  );
}