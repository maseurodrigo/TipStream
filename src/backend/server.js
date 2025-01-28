import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Express app
const app = express();

// Create an HTTP server to serve both the React app and Socket.IO
const server = http.createServer(app);

// Create the Socket.IO instance and attach it to the server
const io = new Server(server, { 
    cors: { methods: ["GET", "POST"] }, 
    pingInterval: 10000, 
    pingTimeout: 30000 
});

// Set up event listeners for Socket.io
io.on('connection', (socket) => {

    // Handle join event when a viewer joins a session
    // + Notify clients when a socket joins or leaves the room
    socket.on('joinRoom', (roomName) => { 
        socket.join(roomName);
        socket.broadcast.to(roomName).emit('roomUpdate', { room: roomName });
    });

    // Handle leave event when a viewer leaves a session
    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit('roomUpdate', { room: roomName });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms].filter((r) => r !== socket.id);
        rooms.forEach((roomName) => { socket.broadcast.to(roomName).emit('roomUpdate', { room: roomName }); });
    });

    // Handle update event from the dashboard
    socket.on('update', (data) => {
        const { sessionID, updates } = data;

        // Broadcast the updates to all other clients in the same session room
        socket.broadcast.to(sessionID).emit('receive-update', updates);
    });
    
    // Custom event to fetch sockets in a room
    socket.on('getRoomSockets', async (roomName, callback) => {
        try {
            const sockets = await socket.in(roomName).fetchSockets();
            const socketIds = sockets.map((sock) => sock.id); // Extract socket IDs
            callback({ success: true, sockets: socketIds });
        } catch (error) {
            callback({ success: false, error: 'Failed to fetch sockets' });
        }
    });
});

// Get the current directory path using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from dist after building
app.use(express.static(path.join(__dirname, 'dist')));

// Start the Express server
server.listen(8888);