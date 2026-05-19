const ChatMessage = require('../models/ChatMessage');

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await ChatMessage.find({ room_id: roomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender_id', 'name avatar');

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { room_id, message, type = 'text' } = req.body;

    if (!room_id || !message) {
      return res.status(400).json({ error: 'room_id and message are required' });
    }

    const chatMessage = await ChatMessage.create({
      room_id,
      sender_id: req.user.id,
      message,
      type,
    });

    const populated = await chatMessage.populate('sender_id', 'name avatar');

    // Emit via Socket.io
    const io = req.app.get('io');
    io.to(room_id).emit('chat:message', populated);

    res.status(201).json({ message: populated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
