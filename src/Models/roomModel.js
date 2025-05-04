const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ],
}, {
  timestamps: true,
});

// Ensure uniqueness of member pairs by sorting them before save
roomSchema.index({ members: 1 }, { unique: true });

// Static method to find or create a room between two users
roomSchema.statics.findOrCreateRoom = async function(userId1, userId2) {
  // Always sort the ObjectIds to maintain order
  const sortedIds = [userId1, userId2].sort((a, b) => a.toString().localeCompare(b.toString()));

  // Try to find an existing room
  let room = await this.findOne({ members: sortedIds });
  if (!room) {
    room = await this.create({ members: sortedIds });
  }
  return room;
};

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
