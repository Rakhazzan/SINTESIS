import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ProfileSettings = ({ user, onUpdateProfile }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      // Fetch profile data from a 'profiles' table if you have one
      // For now, simulate loading a name
      fetchProfileName(user.id);
    }
  }, [user]);

  const fetchProfileName = async (userId) => {
    // Assuming you have a 'profiles' table linked to auth.users
    // with columns like id (matching auth.users.id) and name
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile name:", error.message);
      setName(''); // Default to empty if error
    } else {
      setName(data?.name || '');
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

    // Update profile data in a 'profiles' table
    const { error } = await supabase
      .from('profiles')
      .update({ name: name })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Error updating profile:", error.message);
    } else {
      setSuccess('Perfil actualizado con éxito.');
      // Optionally call onUpdateProfile if needed in parent
      // onUpdateProfile({ ...user, name });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Perfil</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-not-allowed"
              value={email}
              disabled // Email generally not changed easily
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
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