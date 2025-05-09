import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase';
import GlassmorphicCard from '../GlassmorphicCard';
import ModernInput from '../ModernInput';
import ModernButton from '../ModernButton';

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
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      const channel = supabase
        .channel(`chat_${user?.id}_${selectedUser.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `(sender_id=eq.${selectedUser.id}.and.receiver_id=eq.${user?.id}).or.(sender_id=eq.${user?.id}.and.receiver_id=eq.${selectedUser.id})`
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
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
      .from('users') // Assuming 'users' table has id, email, nombre
      .select('id, nombre')
      .neq('id', user?.id);

    if (error) {
      console.error('Error fetching users:', error.message);
      return;
    }

    setUsers(data || []);
  };

  const fetchMessages = async (otherUserId) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`
      )
      .order('timestamp', { ascending: true });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error('Error fetching messages:', error.message);
    } else {
      const relevantMessages = data || [];
      setMessages(relevantMessages);

      const unreadMessageIds = relevantMessages
        .filter((msg) => msg.receiver_id === user?.id && !msg.is_read) // Use is_read as per schema
        .map((msg) => msg.id);

      if (unreadMessageIds.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ is_read: true }) // Use is_read as per schema
          .in('id', unreadMessageIds);

        if (updateError) {
          console.error('Error marking messages as read:', updateError.message);
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
        is_read: false, // Use is_read as per schema
        timestamp: new Date().toISOString() // Add timestamp for immediate display
      };

      // Optimistically add the message to the UI first
      const tempId = `temp-${Date.now()}`;
      const tempMessage = { ...messageData, id: tempId };
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');

      // Then send to database
      const { data, error } = await supabase.from('messages').insert([messageData]).select();

      if (error) {
        setError(error.message);
        console.error('Error sending message:', error.message);
        // Remove the temporary message if there was an error
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
      }
    }
  };

  return (
    <div className="flex h-full p-6">
      {/* User List Sidebar */}
      <GlassmorphicCard className="w-64 mr-6 flex flex-col">
        <h3 className="text-lg font-semibold text-white p-4 border-b border-white border-opacity-10">Usuarios</h3>
        <ul className="flex-grow overflow-y-auto">
          {users.map(otherUser => (
            <li key={otherUser.id}>
              <button
                onClick={() => setSelectedUser(otherUser)}
                className={`w-full text-left px-4 py-3 hover:bg-white hover:bg-opacity-10 transition-colors rounded-md ${selectedUser?.id === otherUser.id ? 'bg-white bg-opacity-20' : ''}`}
              >
                <p className="text-white font-medium">{otherUser.nombre || otherUser.email}</p>
              </button>
            </li>
          ))}
        </ul>
      </GlassmorphicCard>

      {/* Chat Window */}
      <GlassmorphicCard className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="shadow-sm p-4 border-b border-white border-opacity-10">
              <h3 className="text-lg font-semibold text-white">{selectedUser.nombre || selectedUser.email}</h3>
            </div>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-300">Cargando mensajes...</div>
              ) : error ? (
                <div className="text-center text-red-400">Error: {error}</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-300">Inicia una conversación.</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-modern-accent-dynamic text-white'
                          : 'bg-white bg-opacity-10 text-gray-200'
                      }`}
                       style={{ '--color-accent-primary': 'var(--color-accent-primary, #800080)' }} // Default accent color
                    >
                      <p className="text-sm">{message.message}</p>
                      <span className="block text-xs mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex space-x-3 p-4 border-t border-white border-opacity-10">
              <ModernInput
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-grow"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <ModernButton
                type="submit"
                disabled={!newMessage.trim()}
              >
                Enviar
              </ModernButton>
            </form>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-300">
            Selecciona un usuario para empezar a chatear.
          </div>
        )}
      </GlassmorphicCard>
    </div>
  );
};

export default MessagesChat;