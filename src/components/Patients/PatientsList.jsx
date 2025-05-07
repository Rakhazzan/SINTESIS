import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';
import ModernInput from '../ModernInput';

const PatientsList = ({ onEdit, onDelete, onViewAppointments, onAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);


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

  if (loading) return <div className="p-6 text-center text-gray-300">Cargando pacientes...</div>;
  if (error) return <div className="p-6 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Lista de Pacientes</h2>
        <ModernButton
          onClick={onAddPatient}
        >
          Agregar Paciente
        </ModernButton>
      </div>
       <div className="mb-6">
            <ModernInput
                type="text"
                placeholder="Buscar paciente por nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      <GlassmorphicCard>
        {filteredPatients.length === 0 ? (
          <p className="text-gray-300 text-center">No hay pacientes registrados que coincidan con la búsqueda.</p>
        ) : (
          <ul className="divide-y divide-white divide-opacity-10">
            {filteredPatients.map((patient) => (
              <li key={patient.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-white">{patient.name}</p>
                  <p className="text-sm text-gray-300">Nacimiento: {patient.birth_date}</p>
                  <p className="text-sm text-gray-300">Teléfono: {patient.telefono}</p>
                </div>
                <div className="flex space-x-3">
                  <ModernButton
                    onClick={() => onViewAppointments(patient.id)}
                    className="px-3 py-1 text-xs"
                  >
                    Ver Citas
                  </ModernButton>
                  <ModernButton
                    onClick={() => onEdit(patient)}
                    className="px-3 py-1 text-xs"
                  >
                    Editar
                  </ModernButton>
                  <ModernButton
                    onClick={() => onDelete(patient.id)}
                    className="px-3 py-1 text-xs bg-orange-400 hover:bg-orange-500 from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                  >
                    Eliminar
                  </ModernButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassmorphicCard>
    </div>
  );
};

export default PatientsList;