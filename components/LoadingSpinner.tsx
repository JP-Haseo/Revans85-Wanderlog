
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'h-5 w-5' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-t-2 border-b-2 border-current ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
