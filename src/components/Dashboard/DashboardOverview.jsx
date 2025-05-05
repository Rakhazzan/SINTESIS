import React from 'react';

const DashboardOverview = ({ user }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido, {user?.email || 'Usuario'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Citas Próximas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas Próximas</h3>
          <p className="text-gray-600">Aquí verás tus próximas citas.</p>
          {/* Contenido dinámico de citas */}
        </div>
        {/* Tarjeta de Pacientes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Pacientes</h3>
          <p className="text-gray-600">Número total de pacientes registrados.</p>
          {/* Contenido dinámico de pacientes */}
        </div>
        {/* Tarjeta de Mensajes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensajes Nuevos</h3>
          <p className="text-gray-600">Mensajes sin leer.</p>
          {/* Contenido dinámico de mensajes */}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;