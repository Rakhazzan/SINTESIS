import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase';

const MessagesChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [user]); // Fetch users when user changes

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      const channel = supabase
        .channel(`chat_${user?.id}_${selectedUser.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `(sender_id=eq.${selectedUser.id}.and.receiver_id=eq.${user?.id})` }, (payload) => {
           setMessages((prev) => [...prev, payload.new]);
        })
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `(sender_id=eq.${user?.id}.and.receiver_id=eq.${selectedUser.id})` }, (payload) => {
           setMessages((prev) => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
        setMessages([]);
    }
  }, [selectedUser, user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchUsers = async () => {
     const { data, error } = await supabase
      .from('users')
      .select('id, nombre, email')
      .neq('id', user?.id); // Exclude the current user

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data || []);
    }
  };


  const fetchMessages = async (otherUserId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`)
      .order('timestamp', { ascending: true });

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching messages:", error.message);
    } else {
      // Filter messages relevant to the current chat
      const relevantMessages = data.filter(msg =>
        (msg.sender_id === user?.id && msg.receiver_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.receiver_id === user?.id)
      );
      setMessages(relevantMessages || []);

      // Mark messages as read
      if (relevantMessages.length > 0) {
          const unreadMessageIds = relevantMessages
            .filter(msg => msg.receiver_id === user?.id && !msg.is_read)
            .map(msg => msg.id);

          if (unreadMessageIds.length > 0) {
              const { error: updateError } = await supabase
                .from('messages')
                .update({ is_read: true })
                .in('id', unreadMessageIds);

              if (updateError) {
                console.error("Error marking messages as read:", updateError.message);
              }
          }
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        sender_id: user?.id,
        receiver_id: selectedUser.id,
        message: newMessage,
        is_read: false, // Mark as unread initially
        // timestamp se puede generar en la base de datos
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) {
        setError(error.message);
        console.error("Error sending message:", error.message);
      } else {
        setNewMessage('');
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* User List Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">Usuarios</h3>
        <ul className="flex-grow overflow-y-auto">
          {users.map(otherUser => (
            <li key={otherUser.id}>
              <button
                onClick={() => setSelectedUser(otherUser)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedUser?.id === otherUser.id ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
              >
                <p className="text-gray-900 dark:text-white font-medium">{otherUser.nombre || otherUser.email}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.nombre || selectedUser.email}</h3>
            </div>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-600 dark:text-gray-400">Cargando mensajes...</div>
              ) : error ? (
                 <div className="text-center text-red-500">Error: {error}</div>
              ) : messages.length === 0 ? (
                 <div className="text-center text-gray-600 dark:text-gray-400">Inicia una conversación.</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <span className="block text-xs mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex space-x-3 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-600 text-gray-900 dark:text-white transition"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!newMessage.trim()}
              >
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-600 dark:text-gray-400">
            Selecciona un usuario para empezar a chatear.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesChat;