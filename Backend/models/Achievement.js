const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestone: {
    type: Number,
    required: true
  },
  certificateUrl: {
    type: String,
    required: true
  },
  achievedAt: {
    type: Date,
    default: Date.now
  },
  shared: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
