import React from 'react';

const ModernSelect = ({ id, value, onChange, options, required = false, className = '' }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full mt-1 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-modern-primary text-white transition-all duration-300 ease-in-out ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-[#030014] text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ModernSelect;