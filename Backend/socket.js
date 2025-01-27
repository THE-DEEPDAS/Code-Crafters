const socketIO = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: "https://ecobrew.vercel.app/", // Your frontend URL
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
