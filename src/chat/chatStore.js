const chatDB = []; // Each message: { senderId, receiverId, message, timestamp }

exports.saveMessage = (senderId, receiverId, message) => {
  const chat = { senderId, receiverId, message, timestamp: new Date() };
  chatDB.push(chat);
};

exports.getChats = (userId) => {
  return chatDB.filter(c => c.senderId === userId || c.receiverId === userId);
};

exports.getChatHistory = (senderId, receiverId) => {
  return chatDB.filter(c =>
    (c.senderId === senderId && c.receiverId === receiverId) ||
    (c.senderId === receiverId && c.receiverId === senderId)
  );
};
