import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';
import ModernInput from '../ModernInput';
import ModernTextarea from '../ModernTextarea';

const AppointmentsForm = ({ appointment, patients, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    if (patientId && patients.length > 0) {
        const selectedPatient = patients.find(p => p.id === patientId);
        if(selectedPatient) {
            setSearchTerm(selectedPatient.name);
        }
    }
  }, [patientId, patients]);


  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDescription(appointment.description);
      setDate(appointment.date);
      setTime(appointment.time);
      setPatientId(appointment.patient_id);
      setName(appointment.name);
    } else {
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setPatientId('');
      setName('');
    }
  }, [appointment]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      setFilteredPatients(
        patients.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.telefono?.includes(searchTerm)
        )
      );
    } else {
      setFilteredPatients([]);
    }
  }, [searchTerm, patients]);


  const handlePatientSelect = (patient) => {
    setPatientId(patient.id);
    setSearchTerm(patient.name);
    setFilteredPatients([]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setError('Usuario no autenticado.');
      setLoading(false);
      return;
    }

    if (!patientId) {
        setError('Por favor, selecciona un paciente.');
        setLoading(false);
        return;
    }

    const appointmentData = {
      title,
      description,
      date,
      time,
      patient_id: patientId,
      created_by: user.data.user.id,
      name,
    };

    let dbError = null;
    if (appointment) {
      // Editar cita existente
      const { error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', appointment.id);
      dbError = error;
    } else {
      // Agregar nueva cita
      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);
      dbError = error;
    }

    setLoading(false);
    if (dbError) {
      setError(dbError.message);
      console.error("Error saving appointment:", dbError.message);
    } else {
      onSave(); // Notify parent to refresh list
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title" aria-describedby="appointment-form-description">
      <GlassmorphicCard className="w-full max-w-md">
        <h2 id="appointment-form-title" className="text-2xl font-bold text-white mb-6 text-center">
          {appointment ? 'Editar Cita' : 'Agregar Cita'}
        </h2>
        <p id="appointment-form-description" className="sr-only">Formulario para {appointment ? 'editar' : 'agregar'} información de la cita.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Título
            </label>
            <ModernInput
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <ModernTextarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></ModernTextarea>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">
              Fecha
            </label>
            <ModernInput
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300">
              Hora
            </label>
            <ModernInput
              id="time"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="relative">
            <label htmlFor="patient-search" className="block text-sm font-medium text-gray-300">
              Paciente
            </label>
            <ModernInput
              id="patient-search"
              type="text"
              placeholder="Buscar paciente por nombre o teléfono"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPatientId(''); // Clear selected patient when typing
              }}
            />
            {filteredPatients.length > 0 && (
              <ul className="absolute z-10 w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto ring-1 ring-white ring-opacity-10">
                {filteredPatients.map(patient => (
                  <li key={patient.id}>
                    <button
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      {patient.name} ({patient.telefono})
                    </button>
                  </li>
                ))}
              </ul>
            )}
             {patientId && searchTerm && filteredPatients.length === 0 && (
                 <p className="mt-1 text-sm text-gray-400">Paciente seleccionado: {searchTerm}</p>
             )}
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <ModernButton
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600"
            >
              Cancelar
            </ModernButton>
            <ModernButton
              type="submit"
              disabled={loading || !patientId}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </ModernButton>
          </div>
        </form>
      </GlassmorphicCard>
    </div>
  );
};

export default AppointmentsForm;