import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';

const AppointmentsList = ({ patients, onEdit, onDelete, onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'tomorrow', 'this_week', 'morning', 'afternoon', 'evening'
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
      .select('*, patients(name)') // Select appointment data and patient name
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching appointments:", error.message);
    } else {
      setAppointments(data || []);
    }
  };

  const getPatientName = (patientId) => {
    const appointment = appointments.find(a => a.patient_id === patientId);
     return appointment?.patients?.name || 'Paciente Desconocido';
  };

  const handleDeleteClick = async (appointmentId) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
          const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointmentId);

          if (error) {
            console.error("Error deleting appointment:", error.message);
          } else {
            // fetchAppointments is triggered by the channel listener
          }
      }
  };

  const handleViewClick = (appointment) => {
      // Implement logic to show appointment details, e.g., in a modal
      console.log("Viewing appointment:", appointment);
      alert(`Detalles de la Cita:\nTítulo: ${appointment.title}\nPaciente: ${appointment.patients?.name || 'Desconocido'}\nFecha: ${appointment.date}\nHora: ${appointment.time}\nDescripción: ${appointment.description}`);
  };

  const filterAppointments = (apps) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay())); // End of current week

      return apps.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          const [hour] = appointment.time.split(':').map(Number);

          switch (filter) {
              case 'today':
                  return appointmentDate.toDateString() === today.toDateString();
              case 'tomorrow':
                  return appointmentDate.toDateString() === tomorrow.toDateString();
              case 'this_week':
                  return appointmentDate >= today && appointmentDate <= endOfWeek;
              case 'morning':
                  return hour >= 6 && hour < 12;
              case 'afternoon':
                  return hour >= 12 && hour < 18;
              case 'evening':
                  return hour >= 18 || hour < 6; // Evening/Night
              case 'all':
              default:
                  return true;
          }
      });
  };


  if (loading) return <div className="p-6 text-center text-gray-300">Cargando citas...</div>;
  if (error) return <div className="p-6 text-center text-red-400">Error: {error}</div>;

  const filteredAppointments = filterAppointments(appointments);

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Lista de Citas</h2>
        <div className="flex items-center space-x-4">
             {/* Filter Menu Button */}
            <div className="relative">
                <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 rounded-md bg-white bg-opacity-10 text-gray-300 hover:bg-white hover:bg-opacity-20 transition-colors"
                    aria-label="Filtrar citas"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707l3 3A1 1 0 0121 14H3a1 1 0 01-1-1V4z" />
                    </svg>
                </button>
                 {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md shadow-lg py-1 ring-1 ring-white ring-opacity-10 z-50">
                        <button onClick={() => { setFilter('all'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Todas</button>
                        <button onClick={() => { setFilter('today'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Hoy</button>
                        <button onClick={() => { setFilter('tomorrow'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Mañana</button>
                        <button onClick={() => { setFilter('this_week'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Esta Semana</button>
                         <div className="border-t border-white border-opacity-10 my-1"></div>
                        <button onClick={() => { setFilter('morning'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Mañana (Hora)</button>
                        <button onClick={() => { setFilter('afternoon'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Tarde (Hora)</button>
                        <button onClick={() => { setFilter('evening'); setShowFilterMenu(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left">Noche (Hora)</button>
                    </div>
                )}
            </div>

            <ModernButton
              onClick={onAddAppointment}
            >
              Agregar Cita
            </ModernButton>
        </div>
      </div>
      <GlassmorphicCard>
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-300 text-center">No hay citas programadas que coincidan con el filtro.</p>
        ) : (
          <ul className="divide-y divide-white divide-opacity-10">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-white">{appointment.title}</p>
                  <p className="text-sm text-gray-300">Paciente: {appointment.patients?.name || 'Desconocido'}</p>
                  <p className="text-sm text-gray-300">Fecha: {appointment.date} Hora: {appointment.time}</p>
                </div>
                <div className="flex space-x-3">
                   <ModernButton
                    onClick={() => handleViewClick(appointment)}
                    className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500"
                  >
                    Ver Cita
                  </ModernButton>
                  <ModernButton
                    onClick={() => onEdit(appointment)}
                    className="px-3 py-1 text-xs"
                  >
                    Editar
                  </ModernButton>
                  <ModernButton
                    onClick={() => handleDeleteClick(appointment.id)}
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

export default AppointmentsList;