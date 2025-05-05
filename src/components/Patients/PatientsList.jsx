import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const PatientsList = ({ onEdit, onDelete, onViewAppointments, onAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
    const channel = supabase
      .channel('patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
        fetchPatients(); // Refetch data on changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching patients:", error.message);
    } else {
      setPatients(data);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando pacientes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Pacientes</h2>
        <button
          onClick={onAddPatient}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Agregar Paciente
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {patients.length === 0 ? (
          <p className="text-gray-600 text-center">No hay pacientes registrados.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <li key={patient.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">Nacimiento: {patient.birth_date}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewAppointments(patient.id)}
                    className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  >
                    Ver Citas
                  </button>
                  <button
                    onClick={() => onEdit(patient)}
                    className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(patient.id)}
                    className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientsList;