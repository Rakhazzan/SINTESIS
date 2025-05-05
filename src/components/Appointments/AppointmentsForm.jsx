import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const AppointmentsForm = ({ appointment, patients, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientId, setPatientId] = useState('');
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
    } else {
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setPatientId('');
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title" aria-describedby="appointment-form-description">
      <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg transition-colors">
        <h2 id="appointment-form-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {appointment ? 'Editar Cita' : 'Agregar Cita'}
        </h2>
        <p id="appointment-form-description" className="sr-only">Formulario para {appointment ? 'editar' : 'agregar'} información de la cita.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título
            </label>
            <input
              id="title"
              type="text"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              id="description"
              rows="3"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha
            </label>
            <input
              id="date"
              type="date"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hora
            </label>
            <input
              id="time"
              type="time"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="relative">
            <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paciente
            </label>
            <input
              id="patient-search"
              type="text"
              placeholder="Buscar paciente por nombre o teléfono"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPatientId(''); // Clear selected patient when typing
              }}
            />
            {filteredPatients.length > 0 && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <li key={patient.id}>
                    <button
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {patient.name} ({patient.telefono})
                    </button>
                  </li>
                ))}
              </ul>
            )}
             {patientId && searchTerm && filteredPatients.length === 0 && (
                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Paciente seleccionado: {searchTerm}</p>
             )}
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              disabled={loading || !patientId}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsForm;