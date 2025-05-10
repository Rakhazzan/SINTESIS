import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Usa lucide-react o cualquier icono que prefieras

const LayoutSidebar = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Citas', page: 'appointments' },
    { name: 'Pacientes', page: 'patients' },
    { name: 'Mensajes', page: 'messages' },
  ];

  return (
    <>
      {/* Botón hamburguesa solo en móviles */}
<div className="md:hidden fixed top-4 left-4 z-50"> {/* Aumentamos z-50 */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="p-2 text-white bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
</div>


      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white flex flex-col p-4 z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:flex`}
      >
        <div className="text-2xl font-bold mb-6 text-center text-white">Menú</div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.page} className="mb-2">
                <button
                  onClick={() => {
                    onNavigate(item.page);
                    setIsOpen(false); // Cierra el menú al hacer clic en móviles
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentPage === item.page
                      ? 'bg-modern-accent text-white'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default LayoutSidebar;
