const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestone: {
    type: Number,
    required: true
  },
  achievedAt: {
    type: Date,
    default: Date.now
  },
  certificateUrl: {
    type: String
  }
});

// Ensure unique achievements per user and milestone
achievementSchema.index({ userId: 1, milestone: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
