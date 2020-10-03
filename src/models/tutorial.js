const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true,
  },

  tutorial: {
    type: String,
    required: true,
    trim: true,
  },
});

const Tutorial = mongoose.model('Tutorial', TutorialSchema);

module.exports = Tutorial;
