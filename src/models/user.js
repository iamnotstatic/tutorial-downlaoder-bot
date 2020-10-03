const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: false,
    trim: true,
  },
  username: {
    type: String,
    required: false,
    trim: true,
  },
  chatId: {
    type: Number,
    required: true,
    trim: true,
  },
  admin: {
    default: false,
    type: Boolean,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
