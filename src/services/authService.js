const AuthService = {
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem('medibook_users')) || [];
    if (users.some(user => user.email === userData.email)) {
      throw new Error('El usuario ya existe');
    }
    users.push(userData);
    localStorage.setItem('medibook_users', JSON.stringify(users));
    localStorage.setItem('medibook_currentUser', JSON.stringify(userData));
    return userData;
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('medibook_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales incorrectas');
    localStorage.setItem('medibook_currentUser', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('medibook_currentUser');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('medibook_currentUser'));
  }
};

export default AuthService;