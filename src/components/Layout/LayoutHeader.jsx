import React from 'react';

const LayoutHeader = ({ user, onLogout }) => {
  return (
    <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-900">MediFlow</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-sm">Hola, {user?.email || 'Usuario'}</span>
        <button
          onClick={onLogout}
          className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  );
};

export default LayoutHeader;