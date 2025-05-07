import React from 'react';

const ModernButton = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-modern-primary to-modern-secondary hover:from-modern-secondary hover:to-modern-primary transition-all duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ModernButton;