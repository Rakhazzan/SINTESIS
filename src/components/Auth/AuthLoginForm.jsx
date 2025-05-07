import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';
import ModernInput from '../ModernInput';

const AuthLoginForm = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onLoginSuccess(data.user);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <GlassmorphicCard className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <ModernButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Entrar'}
            </ModernButton>
          </div>
        </form>
        <div className="text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <button onClick={onNavigateRegister} className="font-medium text-modern-primary hover:underline">
            Regístrate
          </button>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default AuthLoginForm; 