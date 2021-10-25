"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const connectSockets = (server) => {
    const io = new socket_io_1.Server(server, {
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
exports.default = connectSockets;
