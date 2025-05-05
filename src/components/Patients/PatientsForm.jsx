import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const PatientsForm = ({ patient, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setBirthDate(patient.birth_date);
      setGender(patient.gender);
      setNotes(patient.notes);
      setPhone(patient.telefono || '');
    } else {
      setName('');
      setBirthDate('');
      setGender('');
      setNotes('');
      setPhone('');
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setError('Usuario no autenticado.');
      setLoading(false);
      return;
    }

    const patientData = {
      name,
      birth_date: birthDate,
      gender,
      notes,
      telefono: phone,
      created_by: user.data.user.id,
    };

    let dbError = null;
    if (patient) {
      // Editar paciente existente
      const { error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', patient.id);
      dbError = error;
    } else {
      // Agregar nuevo paciente
      const { error } = await supabase
        .from('patients')
        .insert([patientData]);
      dbError = error;
    }

    setLoading(false);
    if (dbError) {
      setError(dbError.message);
      console.error("Error saving patient:", dbError.message);
    } else {
      onSave(); // Notify parent to refresh list
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" role="dialog" aria-modal="true" aria-labelledby="patient-form-title" aria-describedby="patient-form-description">
      <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg transition-colors">
        <h2 id="patient-form-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {patient ? 'Editar Paciente' : 'Agregar Paciente'}
        </h2>
        <p id="patient-form-description" className="sr-only">Formulario para {patient ? 'editar' : 'agregar'} información del paciente.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Nacimiento
            </label>
            <input
              id="birthDate"
              type="date"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Género
            </label>
            <select
              id="gender"
              required
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Selecciona</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notas
            </label>
            <textarea
              id="notes"
              rows="3"
              className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientsForm;