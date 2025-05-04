const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ensures it's globally unique
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
}, {
  timestamps: true,
});
        
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
