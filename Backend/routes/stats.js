const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const auth = require('../middleware/auth');

router.get('/leaderboard', auth, achievementController.getLeaderboard);
router.get('/achievements', auth, achievementController.getUserAchievements);

router.post('/share-achievement/:achievementId', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.achievementId);
    if (!achievement || achievement.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    achievement.shared = true;
    await achievement.save();
    res.json({ message: 'Achievement shared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
