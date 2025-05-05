import { useState, useEffect } from 'react';
import MessageService from '../services/messageService';

const MessagesPanel = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('medibook_users')) || [];
    setUsers(allUsers.filter(u => u.email !== user.email));
    setMessages(MessageService.getUserMessages(user.email));
  }, [user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const message = {
      ...newMessage,
      from: user.email,
      date: new Date().toISOString(),
      read: false
    };
    
    MessageService.sendMessage(message);
    setMessages([...messages, message]);
    setNewMessage({ to: '', subject: '', content: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Mensajes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`p-4 border rounded-lg ${msg.read ? 'bg-white' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{msg.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {msg.from === user.email ? `Para: ${msg.to}` : `De: ${msg.from}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.date).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
              <select
                value={newMessage.to}
                onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar destinatario</option>
                {users.map(u => (
                  <option key={u.email} value={u.email}>{u.fullName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <input
                type="text"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesPanel;

// DONE