import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ProfileSettings = ({ user, onUpdateProfile }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchProfileData(user.id);
    }
  }, [user]);

  const fetchProfileData = async (userId) => {
    const { data, error } = await supabase
      .from('users') // Assuming 'users' table stores profile data
      .select('nombre, telefono, ocupacion')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile data:", error.message);
      setName('');
      setPhone('');
      setOccupation('');
    } else {
      setName(data?.nombre || '');
      setPhone(data?.telefono || '');
      setOccupation(data?.ocupacion || '');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) {
      setError('Usuario no autenticado.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('users') // Update 'users' table
      .update({ nombre: name, telefono: phone, ocupacion: occupation })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Error updating profile:", error.message);
    } else {
      setSuccess('Perfil actualizado con éxito.');
      // Optionally call onUpdateProfile if needed in parent
      // onUpdateProfile({ ...user, user_metadata: { ...user.user_metadata, nombre: name, telefono: phone, ocupacion: occupation } });
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuración de Perfil</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto transition-colors">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm cursor-not-allowed text-gray-900 dark:text-white"
              value={email}
              disabled // Email generally not changed easily
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ocupación
            </label>
            <input
              id="occupation"
              type="text"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-emerald-500 text-center">{success}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;