import app from './app';
import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Load enviroment variables
require('dotenv').config();

const PORT: string | number = process.env.PORT || 5000;

io.on('connection', (socket) => {
  socket.emit('subscribe');
  console.log(`Connected: ${socket.id}`);
  
  // socket.join();  
  
  socket.on('join-room', (data) => {
    socket.join(data.channel)
  });
  
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
  });
  
  socket.on('send-notification', (data, direction) => {
    console.log(direction);
    console.log(data);
    
    // socket.to(direction).emit('new-notification', data);
    io.to(direction).emit('new-notification', data);
    // io.emit('new-notification', data);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
