import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import ThemeSwitch from '../ThemeSwitch';

const LayoutHeader = ({ user, onLogout, onNavigate, unreadMessagesCount }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogoutClick = () => {
    onLogout();
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    onNavigate('profile');
    setShowProfileMenu(false);
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center transition-colors">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DOCSALUT</h1>
      <div className="flex items-center space-x-4">
        <ThemeSwitch />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => onNavigate('messages')}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Mensajes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.405L4 17h5m6 0a6.002 6.002 0 002-4m0 0V9.158c0-.538.214-1.055.595-1.405l1.405-1.405m-5-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500"></span>
            )}
          </button>
        </div>


        {/* User Profile Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
            aria-label="Menú de perfil"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.email ? user.email[0].toUpperCase() : '?'}
            </div>
            {/* Optional: User name next to icon */}
            {/* <span className="hidden md:inline">{user?.user_metadata?.nombre || user?.email}</span> */}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
              <button
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
              >
                Editar perfil
              </button>
              <button
                onClick={handleLogoutClick}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;