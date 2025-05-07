import React from 'react';

const GlassmorphicCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white border-opacity-20 ${className}`}>
      {children}
    </div>
  );
};

export default GlassmorphicCard;