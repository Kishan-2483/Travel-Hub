import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { Send, MessageSquare, Headphones } from 'lucide-react';
import io from 'socket.io-client';
import './Chat.css';

export default function Chat() {
  const { roomId: paramRoomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState(paramRoomId || `support_${user?._id}`);
  const [typing, setTyping] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = io('http://localhost:3000', {
      auth: { token },
    });

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('chat:join', roomId);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('chat:typing', (data) => {
      setTyping(data.isTyping ? `${data.user} is typing...` : '');
    });

    socketRef.current = socket;

    // Load existing messages
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data } = await chatAPI.getMessages(roomId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:message', {
        room_id: roomId,
        message: newMessage.trim(),
        type: 'text',
      });
    }

    setNewMessage('');
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:typing', {
        room_id: roomId,
        isTyping: value.length > 0,
      });
    }
  };

  return (
    <div className="page container animate-fade-in">
      <div className="chat-layout">
        {/* Sidebar */}
        <div className="chat-sidebar glass">
          <div className="chat-sidebar-header">
            <MessageSquare size={20} />
            <h3>Messages</h3>
          </div>
          <div className="chat-rooms">
            <button
              className={`chat-room-item ${roomId === `support_${user?._id}` ? 'active' : ''}`}
              onClick={() => setRoomId(`support_${user?._id}`)}
            >
              <div className="chat-room-avatar support">
                <Headphones size={18} />
              </div>
              <div className="chat-room-info">
                <span className="chat-room-name">Travel Support</span>
                <span className="chat-room-preview">Get help with your bookings</span>
              </div>
              <div className={`status-dot ${connected ? 'online' : ''}`} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main glass">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-room-avatar support"><Headphones size={18} /></div>
              <div>
                <h3>Travel Support</h3>
                <span className="chat-status">{connected ? 'Online' : 'Connecting...'}</span>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <MessageSquare size={40} />
                <h4>Start a conversation</h4>
                <p>Send a message to get help with your travel plans</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMine = (msg.sender_id?._id || msg.sender_id) === user?._id;
                return (
                  <div key={i} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && <span className="chat-sender">{msg.sender_id?.name || 'Support'}</span>}
                    <p>{msg.message}</p>
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            {typing && <div className="chat-typing">{typing}</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-bar" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
