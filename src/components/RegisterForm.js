import { useState } from 'react';
import AuthFormTitle from './AuthFormTitle';
import AuthFormInput from './AuthFormInput';
import AuthFormSelect from './AuthFormSelect';
import AuthFormButton from './AuthFormButton';
import AuthFormLink from './AuthFormLink';
import AuthNotification from './AuthNotification';
import AuthService from '../services/authService';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const userTypes = [
    { value: 'patient', label: 'Paciente' },
    { value: 'doctor', label: 'Médico' },
    { value: 'admin', label: 'Administrador' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      };
      
      AuthService.register(userData);
      
      setNotification({ 
        message: '¡Registro exitoso!', 
        type: 'success' 
      });
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'patient'
      });
    } catch (error) {
      setNotification({ 
        message: error.message || 'Error al registrar el usuario', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
      <AuthFormTitle>Registro</AuthFormTitle>
      {notification.message && (
        <AuthNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <form onSubmit={handleSubmit}>
        <AuthFormInput
          type="text"
          name="fullName"
          placeholder="Juan Pérez"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <AuthFormInput
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AuthFormInput
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <AuthFormInput
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength="6"
        />
        <AuthFormSelect
          options={userTypes}
          value={formData.userType}
          onChange={handleChange}
          name="userType"
        />
        <AuthFormButton disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </AuthFormButton>
      </form>
      <AuthFormLink onClick={onSwitchToLogin}>
        ¿Ya tienes cuenta? Inicia sesión
      </AuthFormLink>
    </div>
  );
};

export default RegisterForm;