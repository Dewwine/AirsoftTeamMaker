import http from 'http';
import { Server } from 'socket.io';

const connectSockets = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.emit('subscribe');
    console.log(`Connected: ${socket.id}`);

    socket.on('join-room', (data) => {
      socket.join(data.channel);
      socket.join(data.userId);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
    });

    socket.on('send-notification', (data, direction) => {
      io.to(direction).emit('new-notification', data);
    });
  });
};
export default connectSockets;
