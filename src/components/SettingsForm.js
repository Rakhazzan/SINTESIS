import { useState, useEffect } from 'react';
import AuthFormInput from './AuthFormInput';
import AuthFormButton from './AuthFormButton';
import UserService from '../services/userService';

const SettingsForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    try {
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        ...(formData.newPassword && { password: formData.newPassword })
      };
      
      UserService.updateUser(updatedUser);
      onUpdate(updatedUser);
      
      setNotification({ 
        message: 'Configuración actualizada correctamente', 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: error.message || 'Error al actualizar la configuración', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Configuración de usuario</h2>
      
      {notification.message && (
        <div className={`mb-4 p-4 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <AuthFormInput
          type="text"
          name="fullName"
          placeholder="Nombre completo"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        
        <AuthFormInput
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
        />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Cambiar contraseña</h3>
          
          <AuthFormInput
            type="password"
            name="currentPassword"
            placeholder="Contraseña actual"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          
          <AuthFormInput
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            value={formData.newPassword}
            onChange={handleChange}
          />
          
          <AuthFormInput
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nueva contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        
        <AuthFormButton type="submit">
          Guardar cambios
        </AuthFormButton>
      </form>
    </div>
  );
};

export default SettingsForm;