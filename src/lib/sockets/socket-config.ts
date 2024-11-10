// lib/socket.ts
import { Server as SocketIOServer } from "socket.io";

import { getIO } from "../../../server";

export const getSocket = (): SocketIOServer => {
  const io = getIO()
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};
