import { useState, useEffect } from 'react';
import AuthFormInput from './AuthFormInput';
import AuthFormButton from './AuthFormButton';
import UserService from '../services/userService';
import AppointmentService from '../services/appointmentService';

const NewAppointmentForm = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientEmail: '',
    date: '',
    time: '',
    specialty: '',
    notes: ''
  });
  const [patients, setPatients] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user.userType === 'doctor') {
      setPatients(UserService.getPatients());
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const appointment = {
        ...formData,
        doctorEmail: user.email,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      AppointmentService.createAppointment(appointment);
      setNotification({ 
        message: 'Cita creada exitosamente', 
        type: 'success' 
      });
      onSuccess();
    } catch (error) {
      setNotification({ 
        message: error.message || 'Error al crear la cita', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Nueva Cita</h2>
      
      {notification.message && (
        <div className={`mb-4 p-4 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {user.userType === 'doctor' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <select
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(patient => (
                <option key={patient.email} value={patient.email}>
                  {patient.fullName} ({patient.email})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <AuthFormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <AuthFormInput
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <AuthFormInput
          type="text"
          name="specialty"
          placeholder="Especialidad"
          value={formData.specialty}
          onChange={handleChange}
          required
        />
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        
        <AuthFormButton type="submit" className="mt-6">
          Programar cita
        </AuthFormButton>
      </form>
    </div>
  );
};

export default NewAppointmentForm;