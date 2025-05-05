import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const AppointmentsList = ({ patients, onEdit, onDelete, onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        fetchAppointments(); // Refetch data on changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching appointments:", error.message);
    } else {
      setAppointments(data);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente Desconocido';
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando citas...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Citas</h2>
        <button
          onClick={onAddAppointment}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Agregar Cita
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {appointments.length === 0 ? (
          <p className="text-gray-600 text-center">No hay citas programadas.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{appointment.title}</p>
                  <p className="text-sm text-gray-600">Paciente: {getPatientName(appointment.patient_id)}</p>
                  <p className="text-sm text-gray-600">Fecha: {appointment.date} Hora: {appointment.time}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(appointment)}
                    className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
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

export default AppointmentsList;