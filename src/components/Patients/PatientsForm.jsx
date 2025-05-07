import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernButton from '../ModernButton';
import ModernInput from '../ModernInput';
import ModernTextarea from '../ModernTextarea';
import ModernSelect from '../ModernSelect';


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

  const genderOptions = [
      { value: '', label: 'Selecciona' },
      { value: 'Masculino', label: 'Masculino' },
      { value: 'Femenino', label: 'Femenino' },
      { value: 'Otro', label: 'Otro' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="patient-form-title" aria-describedby="patient-form-description">
      <GlassmorphicCard className="w-full max-w-md">
        <h2 id="patient-form-title" className="text-2xl font-bold text-white mb-6 text-center">
          {patient ? 'Editar Paciente' : 'Agregar Paciente'}
        </h2>
        <p id="patient-form-description" className="sr-only">Formulario para {patient ? 'editar' : 'agregar'} información del paciente.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <ModernInput
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">
              Fecha de Nacimiento
            </label>
            <ModernInput
              id="birthDate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
              Teléfono
            </label>
            <ModernInput
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
              Género
            </label>
            <ModernSelect
              id="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={genderOptions}
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
              Notas
            </label>
            <ModernTextarea
              id="notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></ModernTextarea>
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <ModernButton
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600"
            >
              Cancelar
            </ModernButton>
            <ModernButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </ModernButton>
          </div>
        </form>
      </GlassmorphicCard>
    </div>
  );
};

export default PatientsForm;