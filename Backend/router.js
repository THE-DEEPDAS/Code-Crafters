const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Corrected path
const auth = require("./middleware/auth");

const router = express.Router();

router.get("/", (req, res) => { 
    res.send("Welcome to the API!");
})

// Route to serve signup form
router.get("/signup", (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Route to serve signin form
router.get("/signin", (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, recycledCups, dailyCupUsage } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    // Check if username or email exists
    let existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      recycledCups: recycledCups || 0,
      dailyCupUsage: dailyCupUsage || 0,
    });

    await user.save();

    // Generate JWT token with extended expiration time
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Extended to 24 hours
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        recycledCups: user.recycledCups,
        dailyCupUsage: user.dailyCupUsage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with extended expiration time
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Extended to 24 hours
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        recycledCups: user.recycledCups,
        dailyCupUsage: user.dailyCupUsage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update User Recycling Stats
router.patch("/update-stats", auth, async (req, res) => {
  try {
    const { recycledCups, dailyCupUsage } = req.body;
    const userId = req.user.id; // Assumes auth middleware is used

    const user = await User.findByIdAndUpdate(
      userId,
      { recycledCups, dailyCupUsage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      recycledCups: user.recycledCups,
      dailyCupUsage: user.dailyCupUsage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get User Data by ID
router.get("/user/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      recycledCups: user.recycledCups,
      dailyCupUsage: user.dailyCupUsage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get User Data by Username
router.get("/user/:username", auth, async (req, res) => {
  try {
    console.log(`Fetching user data for username: ${req.params.username}`);
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      recycledCups: user.recycledCups,
      dailyCupUsage: user.dailyCupUsage,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
