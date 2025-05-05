import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';

import AuthLoginForm from './components/Auth/AuthLoginForm';
import AuthRegisterForm from './components/Auth/AuthRegisterForm';
import LayoutHeader from './components/Layout/LayoutHeader';
import LayoutSidebar from './components/Layout/LayoutSidebar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import PatientsList from './components/Patients/PatientsList';
import PatientsForm from './components/Patients/PatientsForm';
import AppointmentsList from './components/Appointments/AppointmentsList';
import AppointmentsForm from './components/Appointments/AppointmentsForm';
import MessagesChat from './components/Messages/MessagesChat';
import ProfileSettings from './components/Profile/ProfileSettings';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [patients, setPatients] = useState([]); // Data will come from Supabase
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [errorPatients, setErrorPatients] = useState(null);


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
      }
    });

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
      if (user) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchPatients();
    } else {
      setPatients([]);
    }
  }, [user]);


  const fetchPatients = async () => {
    setLoadingPatients(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    setLoadingPatients(false);
    if (error) {
      setErrorPatients(error.message);
      console.error("Error fetching patients in App:", error.message);
    } else {
      setPatients(data);
    }
  };


  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null);
      setCurrentPage('login');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Lógica de Pacientes
  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handlePatientFormSave = () => {
    setShowPatientForm(false);
    fetchPatients(); // Refresh patients list after save
  };

  const handleDeletePatient = async (patientId) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId);

    if (error) {
      console.error("Error deleting patient:", error.message);
    } else {
      fetchPatients(); // Refresh patients list after delete
    }
  };

  const handleViewPatientAppointments = (patientId) => {
    // Implementar lógica para filtrar citas por paciente
    console.log('Ver citas del paciente:', patientId);
    // Podríamos cambiar a una vista de citas filtrada
  };

  // Lógica de Citas
  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleAppointmentFormSave = () => {
    setShowAppointmentForm(false);
    // AppointmentsList component will fetch its own data
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) {
      console.error("Error deleting appointment:", error.message);
    } else {
      // AppointmentsList component will fetch its own data
    }
  };


  const renderPage = () => {
    if (!user) {
      if (currentPage === 'register') {
        return <AuthRegisterForm onRegisterSuccess={handleRegisterSuccess} onNavigateLogin={() => setCurrentPage('login')} />;
      }
      return <AuthLoginForm onLoginSuccess={handleLoginSuccess} onNavigateRegister={() => setCurrentPage('register')} />;
    }

    return (
      <div className="flex h-screen bg-gray-50">
        <LayoutSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <LayoutHeader user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {currentPage === 'dashboard' && <DashboardOverview user={user} />}
            {currentPage === 'patients' && (
              <PatientsList
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
                onViewAppointments={handleViewPatientAppointments}
                onAddPatient={handleAddPatient}
              />
            )}
            {currentPage === 'appointments' && (
              <AppointmentsList
                patients={patients} // Pass patients for dropdown in form
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
                onAddAppointment={handleAddAppointment}
              />
            )}
            {currentPage === 'messages' && <MessagesChat user={user} />}
            {currentPage === 'profile' && <ProfileSettings user={user} />}
          </main>
        </div>
        {showPatientForm && (
          <PatientsForm
            patient={editingPatient}
            onSave={handlePatientFormSave}
            onCancel={() => setShowPatientForm(false)}
          />
        )}
         {showAppointmentForm && (
          <AppointmentsForm
            appointment={editingAppointment}
            patients={patients} // Pass patients to appointment form
            onSave={handleAppointmentFormSave}
            onCancel={() => setShowAppointmentForm(false)}
          />
        )}
      </div>
    );
  };

  return renderPage();
};

export default App;