const socketIO = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST"]
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
