import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io: Server | undefined;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  if (!io) {
    io = new Server(httpServer);
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
    });
  }

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

// Export `io` for API routes to access it
export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
