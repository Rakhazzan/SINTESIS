import { useState } from 'react';
import AuthFormTitle from './AuthFormTitle';
import AuthFormInput from './AuthFormInput';
import AuthFormButton from './AuthFormButton';
import AuthFormLink from './AuthFormLink';
import AuthNotification from './AuthNotification';
import AuthService from '../services/authService';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      AuthService.login(formData.email, formData.password);
      
      setNotification({ 
        message: '¡Inicio de sesión exitoso!', 
        type: 'success' 
      });
      
      // Redirección simulada
      window.location.reload();
    } catch (error) {
      setNotification({ 
        message: error.message || 'Error al iniciar sesión', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
      <AuthFormTitle>Inicia sesión</AuthFormTitle>
      {notification.message && (
        <AuthNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <form onSubmit={handleSubmit}>
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
        />
        <AuthFormButton disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </AuthFormButton>
      </form>
      <AuthFormLink onClick={onSwitchToRegister}>
        ¿No tienes cuenta? Regístrate
      </AuthFormLink>
    </div>
  );
};

export default LoginForm;

// DONE