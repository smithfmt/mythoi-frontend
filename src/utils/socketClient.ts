import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:5000");

export default socket;