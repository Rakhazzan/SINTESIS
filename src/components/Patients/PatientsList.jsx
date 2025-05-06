import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const PatientsList = ({ onEdit, onDelete, onViewAppointments, onAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);


  useEffect(() => {
    fetchPatients();
  
    const channel = supabase
      .channel('realtime:patients')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
        },
        (payload) => {
          console.log('🔄 Cambio en pacientes:', payload);
          fetchPatients(); // Actualiza los datos cada vez que hay un cambio
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  

  useEffect(() => {
      if (searchTerm) {
          setFilteredPatients(
              patients.filter(patient =>
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.telefono?.includes(searchTerm)
              )
          );
      } else {
          setFilteredPatients(patients);
      }
  }, [searchTerm, patients]);


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
      setPatients(data || []);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600 dark:text-gray-400">Cargando pacientes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lista de Pacientes</h2>
        <button
          onClick={onAddPatient}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Agregar Paciente
        </button>
      </div>
       <div className="mb-6">
            <input
                type="text"
                placeholder="Buscar paciente por nombre o teléfono..."
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        {filteredPatients.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">No hay pacientes registrados que coincidan con la búsqueda.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPatients.map((patient) => (
              <li key={patient.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nacimiento: {patient.birth_date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono: {patient.telefono}</p>
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