import React from 'react';

const LayoutSidebar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Citas', page: 'appointments' },
    { name: 'Pacientes', page: 'patients' },
    { name: 'Mensajes', page: 'messages' },
  ];

  return (
    <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white flex flex-col p-4 transition-colors">
      <div className="text-2xl font-bold mb-6 text-center text-white">Menú</div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.page} className="mb-2">
              <button
                onClick={() => onNavigate(item.page)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                }`}
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