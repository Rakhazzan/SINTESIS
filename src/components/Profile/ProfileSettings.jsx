import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import GlassmorphicCard from "../GlassmorphicCard";
import ModernButton from "../ModernButton";
import ModernInput from "../ModernInput";
import ModernSelect from "../ModernSelect";

const ProfileSettings = ({ user, onUpdateProfile }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("light"); // Default theme

  const themes = [
    { name: "Default Claro", value: "light" },
    { name: "Aurora", value: "aurora" },
    { name: "Ocean", value: "ocean" },
    { name: "Forest", value: "forest" },
  ];

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      fetchProfileData(user.id);
    }
  }, [user]);

  useEffect(() => {
    const savedThemePreference = localStorage.getItem("themePreference");
    if (
      savedThemePreference &&
      themes.some((theme) => theme.value === savedThemePreference)
    ) {
      setSelectedTheme(savedThemePreference);
      applyTheme(savedThemePreference);
    } else {
      // Apply default light theme if no valid preference
      setSelectedTheme("light");
      applyTheme("light");
    }
  }, []);

  const fetchProfileData = async (userId) => {
    const { data, error } = await supabase
      .from("users") // Assuming 'users' table stores profile data
      .select("nombre, telefono, ocupacion")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile data:", error.message);
      setName("");
      setPhone("");
      setOccupation("");
    } else {
      setName(data?.nombre || "");
      setPhone(data?.telefono || "");
      setOccupation(data?.ocupacion || "");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("users") // Update 'users' table
      .update({ nombre: name, telefono: phone, ocupacion: occupation })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Error updating profile:", error.message);
    } else {
      setSuccess("Perfil actualizado con éxito.");
      // Optionally call onUpdateProfile if needed in parent
      // onUpdateProfile({ ...user, user_metadata: { ...user.user_metadata, nombre: name, telefono: phone, ocupacion: occupation } });
    }
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setSelectedTheme(newTheme);
    localStorage.setItem("themePreference", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (theme) => {
    document.documentElement.classList.remove(
      "light",
      "dark",
      "aurora",
      "ocean",
      "forest"
    );
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.add(theme);
      document.documentElement.classList.remove("dark", "light"); // Ensure default themes are removed for custom themes
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Configuración de Perfil
      </h2>
      <GlassmorphicCard className="max-w-md mx-auto">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Correo Electrónico
            </label>
            <ModernInput
              id="email"
              type="email"
              required
              value={email}
              disabled
              onChange={() => {}}
            />
          </div>
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-300"
            >
              Nombre
            </label>
            <ModernInput
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300"
            >
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
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-gray-300"
            >
              Ocupación
            </label>
            <ModernInput
              id="occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label
              htmlFor="theme-select"
              className="block text-sm font-medium text-gray-300"
            >
              Tema Visual
            </label>
            <ModernSelect
              id="theme-select"
              value={selectedTheme}
              onChange={handleThemeChange}
              options={themes}
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-400 text-center">{success}</p>
          )}
          <div>
            <ModernButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Perfil"}
            </ModernButton>
          </div>
        </form>
      </GlassmorphicCard>
    </div>
  );
};

export default ProfileSettings;
