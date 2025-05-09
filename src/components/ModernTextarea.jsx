import React from 'react';

const ModernTextarea = ({ id, placeholder, value, onChange, rows = 3, required = false, className = '' }) => {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className={`w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-modern-primary text-white placeholder-gray-300 transition-all duration-300 ease-in-out resize-none ${className}`}
    ></textarea>
  );
};

export default ModernTextarea;