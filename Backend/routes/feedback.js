const express = require('express');
const { spawn } = require('child_process');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { recycledCups, dailyCupUsage } = user;

    // Execute the Python script
    const pythonProcess = spawn('python', ['../AI/feedback.py', recycledCups, dailyCupUsage]);

    pythonProcess.stdout.on('data', (data) => {
      const feedback = JSON.parse(data.toString());
      res.json(feedback);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ message: 'Error executing Python script' });
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Python script exited with code ${code}`);
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
