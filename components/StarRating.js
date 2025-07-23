// components/StarRating.js
import React, { useState } from 'react';
import { Star } from 'lucide-react'; // Import the Star icon

export default function StarRating({ initialRating = 0, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0); // State to track rating on hover
  const [clickedRating, setClickedRating] = useState(initialRating); // State to track selected rating

  const handleStarClick = (ratingValue) => {
    setClickedRating(ratingValue);
    if (onRatingChange) {
      onRatingChange(ratingValue); // Notify parent component of the new rating
    }
  };

  const handleStarHover = (ratingValue) => {
    setHoverRating(ratingValue);
  };

  const handleMouseLeave = () => {
    setHoverRating(0); // Reset hover rating when mouse leaves the component
  };

  return (
    <div className="d-flex align-items-center" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <Star
          key={starValue}
          size={24} // Adjust star size as needed
          // Determine fill color based on hover or clicked state
          fill={starValue <= (hoverRating || clickedRating) ? '#FFD700' : 'none'} // Gold color for filled stars
          color="#FFD700" // Outline color for all stars
          className="me-1" // Add some margin between stars
          style={{ cursor: 'pointer', transition: 'fill 0.2s ease-in-out' }} // Smooth transition
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      ))}
      {/* Optional: Display selected rating number */}
      <span className="ms-2 text-muted small">
        {clickedRating > 0 ? `(${clickedRating}/5)` : ''}
      </span>
    </div>
  );
}