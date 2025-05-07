import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';

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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Bienvenido, {user?.user_metadata?.nombre || user?.email || 'Usuario'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Total Pacientes */}
        <GlassmorphicCard>
          <h3 className="text-lg font-semibold text-white mb-4">Total Pacientes</h3>
          {loadingPatients ? (
            <p className="text-gray-300">Cargando...</p>
          ) : errorPatients ? (
            <p className="text-red-400">Error: {errorPatients}</p>
          ) : (
            <p className="text-3xl font-bold text-modern-primary">{totalPatients}</p>
          )}
        </GlassmorphicCard>

        {/* Tarjeta de Citas Próximas */}
        <GlassmorphicCard className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Citas Próximas</h3>
          {loadingAppointments ? (
             <p className="text-gray-300">Cargando...</p>
          ) : errorAppointments ? (
             <p className="text-red-400">Error: {errorAppointments}</p>
          ) : upcomingAppointments.length === 0 ? (
            <p className="text-gray-300">No hay citas próximas.</p>
          ) : (
            <ul className="divide-y divide-white divide-opacity-10">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="py-3">
                  <p className="text-white font-medium">{appointment.title}</p>
                  <p className="text-sm text-gray-300">Paciente: {appointment.patients?.name || 'Desconocido'}</p>
                  <p className="text-sm text-gray-300">Fecha: {appointment.date} Hora: {appointment.time}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassmorphicCard>

        {/* Tarjeta de Mensajes Nuevos (Placeholder) */}
         <GlassmorphicCard>
          <h3 className="text-lg font-semibold text-white mb-4">Mensajes Nuevos</h3>
          <p className="text-gray-300">Verifica la sección de Mensajes.</p>
          {/* Contenido dinámico de mensajes */}
        </GlassmorphicCard>
      </div>
    </div>
  );
};

export default DashboardOverview;