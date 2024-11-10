import { io } from "socket.io-client";
import { useEffect } from "react";

export default function useSocket() {
  useEffect(() => {
    const socket = io(process.env.FRONTEND_URL || "http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Define other event listeners here

    return () => {
      socket.disconnect();
    };
  }, []);
}
