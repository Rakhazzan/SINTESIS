import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';
import ModernInput from '../ModernInput';

const AuthRegisterForm = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nombre: name,
          telefono: phone,
          ocupacion: occupation,
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onRegisterSuccess(data.user);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <GlassmorphicCard className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">Registrarse</h2>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <ModernInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <ModernInput
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre Completo
            </label>
            <ModernInput
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
              Teléfono
            </label>
            <ModernInput
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">
              Ocupación
            </label>
            <ModernInput
              id="occupation"
              name="occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <ModernButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Registrar'}
            </ModernButton>
          </div>
        </form>
        <div className="text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onNavigateLogin} className="font-medium text-modern-primary hover:underline">
            Iniciar Sesión</button>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default AuthRegisterForm;