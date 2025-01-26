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
    socket.on('join', (sessionId) => { socket.join(sessionId); });

    // Handle update event from the dashboard
    socket.on('update', (data) => {
        const { sessionID, updates } = data;
        
        // Broadcast the updates to all other clients in the same session room
        socket.broadcast.to(sessionID).emit('receive-update', updates);
    });
});

// Get the current directory path using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from dist after building
app.use(express.static(path.join(__dirname, 'dist')));

// Start the Express server
server.listen(process.env.PORT || 8888, '0.0.0.0');