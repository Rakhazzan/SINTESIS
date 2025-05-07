import React from 'react';

const ModernInput = ({ id, type = 'text', placeholder, value, onChange, required = false, className = '' }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-modern-primary text-black placeholder-gray-300 transition-all duration-300 ease-in-out ${className}`}
    />
  );
};

export default ModernInput;