const { Server } = require("socket.io");
const Room = require('./Models/roomModel');
const Message = require('./Models/chatModel');

const connectedUsers = {}; // userId => socketId
console.log(Room,'*******Room');

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend origin in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // User joins with their userId
    socket.on("connectRoom", (userId) => {
      if (!userId) return socket.emit("connectRoomError", { message: "No userId provided" });

      connectedUsers[userId] = socket.id;
      console.log("🟢 User connected:", userId);
      socket.emit("connectRoomOk", { message: "Connected", userId });
    });

    // Send message
    socket.on("sendMessage", async ({ from, to, message }) => {
      try {
        // Ensure room exists or create one
        let room = await Room.findOne({
          members: { $all: [from, to] },
          $expr: { $eq: [{ $size: "$members" }, 2] }
        });
console.log(room,'<-0-0-0-0-0-room');

        if (!room) {
          room = await Room.create({ members: [from, to] });
        }

        // Save message to DB
        const savedMessage = await Message.create({
          senderId: from,
          receiverId: to,
          content: message,
          roomId: room._id
        });

        // Emit to receiver
        const targetSocket = connectedUsers[to];
        if (targetSocket) {
          io.to(targetSocket).emit("receiveMessage", {
            from,
            message,
            roomId: room._id,
            timestamp: savedMessage.createdAt,
          });
        }

        // Confirm to sender
        socket.emit("sendMessageOk", {
          to,
          message,
          roomId: room._id,
          timestamp: savedMessage.createdAt,
        });
      } catch (err) {
        console.error("❌ Error in sendMessage:", err);
        socket.emit("sendMessageError", { message: "Failed to send message" });
      }
    });

    // Get chat list
    socket.on("getChatList", async (userId) => {
      try {
        const rooms = await Room.find({ members: userId });
        const chatUsers = rooms
          .flatMap(room => room.members)
          .filter(id => id !== userId);
        const uniqueUsers = [...new Set(chatUsers)];

        socket.emit("chatList", uniqueUsers);
      } catch (err) {
        console.error("❌ Error in getChatList:", err);
        socket.emit("chatListError", { message: "Failed to fetch chat list" });
      }
    });

    // Get chat history
    socket.on("getChatHistory", async ({ user1, user2 }) => {
      try {
        const room = await Room.findOne({
          members: { $all: [user1, user2] },
          $expr: { $eq: [{ $size: "$members" }, 2] }
        });

        if (!room) {
          return socket.emit("chatHistory", []);
        }

        const history = await Message.find({ roomId: room._id }).sort({ createdAt: 1 });

        socket.emit("chatHistory", history);
      } catch (err) {
        console.error("❌ Error in getChatHistory:", err);
        socket.emit("chatHistoryError", { message: "Failed to fetch history" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          console.log("🔴 User removed:", userId);
          break;
        }
      }
    });
  });
}

module.exports = initSocket;

// 681435697c837c3464aff295