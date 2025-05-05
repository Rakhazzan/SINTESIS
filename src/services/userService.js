const UserService = {
  getUsers: () => {
    return JSON.parse(localStorage.getItem('medibook_users')) || [];
  },

  updateUser: (updatedUser) => {
    const users = JSON.parse(localStorage.getItem('medibook_users')) || [];
    const updatedUsers = users.map(user => 
      user.email === updatedUser.email ? updatedUser : user
    );
    localStorage.setItem('medibook_users', JSON.stringify(updatedUsers));
    
    const currentUser = JSON.parse(localStorage.getItem('medibook_currentUser'));
    if (currentUser && currentUser.email === updatedUser.email) {
      localStorage.setItem('medibook_currentUser', JSON.stringify(updatedUser));
    }
  },

  getPatients: () => {
    const users = JSON.parse(localStorage.getItem('medibook_users')) || [];
    return users.filter(user => user.userType === 'patient');
  }
};

export default UserService;