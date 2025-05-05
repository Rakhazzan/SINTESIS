import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const DashboardOverview = ({ user }) => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorPatients, setErrorPatients] = useState(null);
  const [errorAppointments, setErrorAppointments] = useState(null);

  useEffect(() => {
    fetchTotalPatients();
    fetchUpcomingAppointments();

    const patientsChannel = supabase
      .channel('patients_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchTotalPatients();
      })
      .subscribe();

    const appointmentsChannel = supabase
      .channel('appointments_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchUpcomingAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(appointmentsChannel);
    };
  }, [user]);

  const fetchTotalPatients = async () => {
    setLoadingPatients(true);
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    setLoadingPatients(false);
    if (error) {
      setErrorPatients(error.message);
      console.error("Error fetching total patients:", error.message);
    } else {
      setTotalPatients(count || 0);
    }
  };

  const fetchUpcomingAppointments = async () => {
    setLoadingAppointments(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(name)') // Select appointment data and patient name
      .gte('date', today) // Filter for today or future dates
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(5); // Limit to a few upcoming appointments

    setLoadingAppointments(false);
    if (error) {
      setErrorAppointments(error.message);
      console.error("Error fetching upcoming appointments:", error.message);
    } else {
      setUpcomingAppointments(data || []);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bienvenido, {user?.user_metadata?.nombre || user?.email || 'Usuario'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Total Pacientes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Pacientes</h3>
          {loadingPatients ? (
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          ) : errorPatients ? (
            <p className="text-red-500">Error: {errorPatients}</p>
          ) : (
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalPatients}</p>
          )}
        </div>

        {/* Tarjeta de Citas Próximas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 col-span-1 md:col-span-2 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Citas Próximas</h3>
          {loadingAppointments ? (
             <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          ) : errorAppointments ? (
             <p className="text-red-500">Error: {errorAppointments}</p>
          ) : upcomingAppointments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay citas próximas.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="py-3">
                  <p className="text-gray-900 dark:text-white font-medium">{appointment.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paciente: {appointment.patients?.name || 'Desconocido'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fecha: {appointment.date} Hora: {appointment.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tarjeta de Mensajes Nuevos (Placeholder) */}
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mensajes Nuevos</h3>
          <p className="text-gray-600 dark:text-gray-400">Verifica la sección de Mensajes.</p>
          {/* Contenido dinámico de mensajes */}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;