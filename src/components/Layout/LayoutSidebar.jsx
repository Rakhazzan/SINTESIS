import React from 'react';

const LayoutSidebar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Citas', page: 'appointments' },
    { name: 'Pacientes', page: 'patients' },
    { name: 'Mensajes', page: 'messages' },
  ];

  return (
    <aside className="w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white flex flex-col p-4 transition-colors z-30">
      <div className="text-2xl font-bold mb-6 text-center text-white">Menú</div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.page} className="mb-2">
              <button
                onClick={() => onNavigate(item.page)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  currentPage === item.page
                    ? 'bg-modern-accent-dynamic text-white'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`}
                 style={{ '--color-accent-primary': 'var(--color-accent-primary, #800080)' }} // Default accent color
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LayoutSidebar;