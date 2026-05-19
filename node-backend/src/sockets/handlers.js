const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');

const setupSocketHandlers = (io) => {
  // Authenticate socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.user.id})`);
    
    // Join user's personal room for notifications
    socket.join(`user:${socket.user.id}`);

    // Join a chat room
    socket.on('chat:join', (roomId) => {
      socket.join(roomId);
      console.log(`💬 ${socket.user.name} joined room: ${roomId}`);
    });

    // Leave a chat room
    socket.on('chat:leave', (roomId) => {
      socket.leave(roomId);
    });

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        const { room_id, message, type = 'text' } = data;
        
        const chatMessage = await ChatMessage.create({
          room_id,
          sender_id: socket.user.id,
          message,
          type,
        });

        const populated = await chatMessage.populate('sender_id', 'name avatar');
        io.to(room_id).emit('chat:message', populated);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
      socket.to(data.room_id).emit('chat:typing', {
        user: socket.user.name,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
  });
};

// Helper to send notification via socket
const sendNotification = async (io, userId, notification) => {
  try {
    const notif = await Notification.create({
      user_id: userId,
      ...notification,
    });
    io.to(`user:${userId}`).emit('notification:new', notif);
    return notif;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

module.exports = { setupSocketHandlers, sendNotification };
