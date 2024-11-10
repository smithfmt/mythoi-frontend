import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO");

    const io = new Server(res.socket.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      // Your socket event handlers here
      socket.on("someEvent", (data) => {
        console.log("Event received:", data);
        // Handle the event
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    // Attach the io instance to the server
    res.socket.server.io = io;
  }

  res.end();
}
