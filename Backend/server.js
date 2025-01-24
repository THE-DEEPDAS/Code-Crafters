require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const routes = require('./router');
const passport = require('./config/passport');
const http = require('http');
const socketInit = require('./socket');

const app = express(); 
const server = http.createServer(app);
const io = socketInit.init(server);

// Connect to MongoDB
connectDB();

// Middleware 
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Middleware to serve static files
app.use(express.static('public'));

// Routes
app.use('/api', routes);

// Routes for serving signup and signin forms
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('joinLeaderboard', () => {
    socket.join('leaderboard');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press CTRL+C to stop the server');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

module.exports = app;
