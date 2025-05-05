const MessageService = {
  getMessages: () => {
    return JSON.parse(localStorage.getItem('medibook_messages')) || [];
  },

  sendMessage: (message) => {
    const messages = JSON.parse(localStorage.getItem('medibook_messages')) || [];
    messages.push(message);
    localStorage.setItem('medibook_messages', JSON.stringify(messages));
  },

  getUserMessages: (email) => {
    const messages = JSON.parse(localStorage.getItem('medibook_messages')) || [];
    return messages.filter(msg => msg.to === email || msg.from === email);
  }
};

export default MessageService;