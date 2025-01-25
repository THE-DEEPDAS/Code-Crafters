const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String,
    required: true
  },
  recycledCups: { 
    type: Number, 
    default: 0,
    min: 0
  },
  dailyCupUsage: { 
    type: Number, 
    default: 0,
    min: 0
  },
  streak: {
    count: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  achievementCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add method to check and update streak
UserSchema.methods.updateStreak = function() {
  try {
    const today = new Date();
    const lastUpdate = this.streak.lastUpdated;
    
    // Check if last update was yesterday
    const isConsecutiveDay = (
      today.getDate() - lastUpdate.getDate() === 1 ||
      (today.getDate() === 1 && lastUpdate.getMonth() !== today.getMonth())
    );
  
    if (isConsecutiveDay) {
      this.streak.count += 1;
    } else if (today.getDate() - lastUpdate.getDate() > 1) {
      this.streak.count = 1;
    }
    
    this.streak.lastUpdated = today;
  } catch (error) {
    console.error('Error updating streak:', error);
    // Handle error appropriately, e.g., throw or set default values
  }
};

module.exports = mongoose.model('User', UserSchema);