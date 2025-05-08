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
import AnimatedBackground from './components/AnimatedBackground';
import AnimatedLanding from './components/AnimatedLanding';
import ModernButton from "./components/ModernButton";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || 'landing');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [errorPatients, setErrorPatients] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const lastPage = localStorage.getItem('currentPage') || 'dashboard';
        setCurrentPage(lastPage);
      } else {
        setCurrentPage('landing');
        localStorage.removeItem('currentPage');
      }
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
      if (user) {
        const lastPage = localStorage.getItem('currentPage') || 'dashboard';
        setCurrentPage(lastPage);
      } else {
        setCurrentPage('landing');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchUnreadMessagesCount(user.id);

      const messagesChannel = supabase
        .channel('unread_messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => {
          fetchUnreadMessagesCount(user.id);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    } else {
      setPatients([]);
      setUnreadMessagesCount(0);
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
      setPatients(data || []);
    }
  };

  const fetchUnreadMessagesCount = async (userId) => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error("Error fetching unread messages count:", error.message);
      setUnreadMessagesCount(0);
    } else {
      setUnreadMessagesCount(count || 0);
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
      setCurrentPage('landing');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

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
    fetchPatients();
  };

  const handleDeletePatient = async (patientId) => {
    const { error } = await supabase.from('patients').delete().eq('id', patientId);
    if (error) {
      console.error("Error deleting patient:", error.message);
    } else {
      fetchPatients();
    }
  };

  const handleViewPatientAppointments = (patientId) => {
    console.log('Ver citas del paciente:', patientId);
  };

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
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
    if (error) {
      console.error("Error deleting appointment:", error.message);
    }
  };

  const handleEnterKeyNavigation = () => {
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!user) {
      if (currentPage === 'register') {
        return <AuthRegisterForm onRegisterSuccess={handleRegisterSuccess} onNavigateLogin={() => setCurrentPage('login')} />;
      }
      if (currentPage === 'login') {
        return <AuthLoginForm onLoginSuccess={handleLoginSuccess} onNavigateRegister={() => setCurrentPage('register')} />;
      }
      return (
        <div>
          <AnimatedLanding onAnimationComplete={handleEnterKeyNavigation} />
        </div>
      );
    }

    return (
      <div className="flex h-screen bg-modern-black text-white font-sans">
        <AnimatedBackground />
        <LayoutSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <LayoutHeader user={user} onLogout={handleLogout} onNavigate={handleNavigate} unreadMessagesCount={unreadMessagesCount} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
            {currentPage === 'dashboard' && <DashboardOverview user={user} />}
            {currentPage === 'patients' && (
              <PatientsList
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
                onViewPatientAppointments={handleViewPatientAppointments}
                onAddPatient={handleAddPatient}
              />
            )}
            {currentPage === 'appointments' && (
              <AppointmentsList
                patients={patients}
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
            patients={patients}
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