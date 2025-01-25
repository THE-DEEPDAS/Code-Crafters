const Achievement = require("../models/Achievement");
const User = require("../models/User");
const { createCertificate } = require("../utils/certificateGenerator");
const socketIO = require("../socket");

const MILESTONES = [100, 500, 1000, 5000, 10000];

exports.checkAchievements = async (userId, cupsRecycled) => {
  try {
    const user = await User.findById(userId);
    const milestone = MILESTONES.find(
      (m) => cupsRecycled >= m && !user.achievements?.includes(m)
    );

    if (milestone) {
      const certificateUrl = await createCertificate(user.username, milestone);
      const achievement = new Achievement({
        userId,
        milestone,
        certificateUrl,
      });
      await achievement.save();
      return achievement;
    }
    return null;
  } catch (error) {
    console.error("Achievement check error:", error);
    return null;
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find(
      {},
      "username recycledCups achievementCount"
    )
      .sort({ recycledCups: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: error.message });
  }
};

exports.getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id }).sort({
      milestone: 1,
    });
    res.json(achievements);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching achievements", error: error.message });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const { milestone } = req.body;
    const userId = req.user.id;

    // Check if achievement already exists
    const existingAchievement = await Achievement.findOne({
      userId,
      milestone,
    });

    if (existingAchievement) {
      return res.status(400).json({ message: "Achievement already exists" });
    }

    const achievement = new Achievement({
      userId,
      milestone,
      achievedAt: new Date(),
    });

    await achievement.save();

    // Update user's achievement count
    await User.findByIdAndUpdate(userId, {
      $inc: { achievementCount: 1 },
    });

    res.status(201).json(achievement);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating achievement", error: error.message });
  }
};

exports.updateUserStats = async (req, res) => {
  try {
    const { recycledCups, dailyCupUsage } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.recycledCups = recycledCups;
    user.dailyCupUsage = dailyCupUsage;
    user.updateStreak();
    await user.save();

    // Check for achievements
    const achievement = await this.checkAchievements(userId, recycledCups);

    // Update leaderboard in real-time
    const leaderboard = await User.aggregate([
      { $sort: { recycledCups: -1 } },
      { $limit: 10 },
      { $project: { username: 1, recycledCups: 1, streak: 1 } },
    ]);

    const io = socketIO.getIO();
    io.to("leaderboard").emit("leaderboardUpdate", leaderboard);

    res.json({
      user,
      achievement,
      streak: user.streak,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
