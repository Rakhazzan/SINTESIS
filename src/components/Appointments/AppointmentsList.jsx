import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";
import GlassmorphicCard from "../GlassmorphicCard";
import ModernButton from "../ModernButton";
import ModernInput from "../ModernInput";

const AppointmentsList = ({ onEdit, onDelete, onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";
  const patientFilter = params.get("patient") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel("appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => fetchAppointments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    let query = supabase
      .from("appointments")
      .select("*, patients(id, name, telefono)")
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    
    // Apply patient filter if provided
    if (patientFilter) {
      query = query.eq("name", patientFilter);
    }

    const { data, error } = await query;

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching appointments:", error.message);
    } else {
      setAppointments(data || []);
    }
  };

  const getPatientName = (appointment) => {
    return appointment?.patients?.name || "Paciente Desconocido";
  };

  const handleDeleteClick = async (appointmentId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);
      if (error) console.error("Error deleting appointment:", error.message);
    }
  };

  const handleViewClick = (appointment) => {
    alert(
      `Detalles de la Cita:\nTítulo: ${
        appointment.title
      }\nPaciente: ${getPatientName(appointment)}\nFecha: ${
        appointment.date
      }\nHora: ${appointment.time}\nDescripción: ${appointment.description}`
    );
  };

  const handleClearFilters = () => {
    // Clear all filters and navigate back to appointments page without params
    navigate('/appointments');
    setSearchTerm('');
  };

  const filterAppointments = (apps) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    return apps.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const [hour] = appointment.time.split(":").map(Number);

      const matchesFilter = (() => {
        switch (filter) {
          case "today":
            return appointmentDate.toDateString() === today.toDateString();
          case "tomorrow":
            return appointmentDate.toDateString() === tomorrow.toDateString();
          case "this_week":
            return appointmentDate >= today && appointmentDate <= endOfWeek;
          case "morning":
            return hour >= 6 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 || hour < 6;
          case "all":
          default:
            return true;
        }
      })();

      const matchesSearch =
        appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patients?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patients?.telefono?.includes(searchTerm);

      return matchesFilter && matchesSearch;
    });
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-300">Cargando citas...</div>
    );
  if (error)
    return <div className="p-6 text-center text-red-400">Error: {error}</div>;

  const filteredAppointments = filterAppointments(appointments);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {patientFilter ? `Citas del Paciente` : "Lista de Citas"}
        </h2>
        <div className="flex items-center space-x-4">
          {/* Filtro de horario */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="p-2 rounded-md bg-white bg-opacity-10 text-gray-300 hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Filtrar citas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707l3 3A1 1 0 0121 14H3a1 1 0 01-1-1V4z"
                />
              </svg>
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md shadow-lg py-1 ring-1 ring-white ring-opacity-10 z-50">
                {[
                  { key: "all", label: "Todas" },
                  { key: "today", label: "Hoy" },
                  { key: "tomorrow", label: "Mañana" },
                  { key: "this_week", label: "Esta Semana" },
                  { key: "morning", label: "Mañana (Hora)" },
                  { key: "afternoon", label: "Tarde (Hora)" },
                  { key: "evening", label: "Noche (Hora)" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setFilter(option.key);
                      setShowFilterMenu(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-white hover:bg-opacity-10 w-full text-left"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Clear filters button (only visible when filtering by patient) */}
          {patientFilter && (
            <ModernButton
              onClick={handleClearFilters}
              className="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500"
            >
              Ver Todas las Citas
            </ModernButton>
          )}
          
          <ModernButton
            onClick={onAddAppointment}
            className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500"
          >
            Agregar Cita
          </ModernButton>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <ModernInput
          type="text"
          placeholder="Buscar por título, paciente o descripción"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <GlassmorphicCard>
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-300 text-center">
            No hay citas que coincidan con el filtro y la búsqueda.
          </p>
        ) : (
          <ul className="divide-y divide-white divide-opacity-10">
            {filteredAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    {appointment.title}
                  </p>
                  <p className="text-sm text-gray-300">
                    Paciente: {getPatientName(appointment)}
                  </p>
                  <p className="text-sm text-gray-300">
                    Fecha: {appointment.date} Hora: {appointment.time}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <ModernButton
                    onClick={() => handleViewClick(appointment)}
                    className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500"
                  >
                    Ver Cita
                  </ModernButton>
                  <ModernButton
                    onClick={() => onEdit(appointment)}
                    className="px-3 py-1 text-xs"
                  >
                    Editar
                  </ModernButton>
                  <ModernButton
                    onClick={() => handleDeleteClick(appointment.id)}
                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 from-red-500 to-red-600 hover:from-red-600 hover:to-red-500"
                  >
                    Eliminar
                  </ModernButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassmorphicCard>
    </div>
  );
};

export default AppointmentsList;