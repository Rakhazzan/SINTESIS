import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase';

const MessagesChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        sender_id: user?.id,
        content: newMessage,
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

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando mensajes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mensajes</h2>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto bg-white rounded-xl shadow-lg p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender_id === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="block text-xs mt-1 opacity-75">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-3">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
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
    </div>
  );
};

export default MessagesChat;