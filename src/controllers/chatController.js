const Message = require('../Models/chatModel');
const Room = require('../Models/roomModel');
const User = require('../Models/userModel');

// Send a message
exports.sendMessage = async (req, res) => {
  const senderId = req.user.userId; // From auth middleware
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: 'receiverId and content are required' });
  }

  try {
    // Find or create the room
    const room = await Room.findOrCreateRoom(senderId, receiverId);

    // Create the message
    const message = await Message.create({
      senderId,
      receiverId,
      roomId: room._id,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get all messages in a room
exports.getMessagesByRoom = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const messages = await Message.find({ roomId })
      .sort({ timestamp: 1 }) // Oldest to newest
      .populate('senderId', 'userId email');

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Optional: Get inbox (latest message per room)
exports.getInbox = async (req, res) => {
    console.log('hiiii');
    
  const userId = req.user.userId;

  try {
    const rooms = await Room.find({ members: userId });

    const inbox = await Promise.all(rooms.map(async (room) => {
      const lastMessage = await Message.findOne({ roomId: room._id })
        .sort({ timestamp: -1 });

      const otherUserId = room.members.find(id => id.toString() !== userId.toString());
      const otherUser = await User.findById(otherUserId).select('userId email');

      return {
        roomId: room._id,
        user: otherUser,
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.timestamp || null,
      };
    }));

    res.status(200).json(inbox);
  } catch (err) {
    console.error('Inbox Error:', err);
    res.status(500).json({ message: 'Failed to fetch inbox' });
  }
};
