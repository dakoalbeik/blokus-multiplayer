// src/server.ts
import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import {Game, Move} from '../models/game';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const game = new Game();

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('joinGame', (name: string) => {
        const success = game.addPlayer(name, socket.id);
        if (success) {

            socket.join('blokusGame'); // Join a room for the game
            io.to('blokusGame').emit('gameState', {playerId: socket.id, gameState: game.getState()}); // Broadcast updated game state

            console.log(`Player joined: ${name}`);
        } else {
            socket.emit('error', 'Failed to join. Game is at max capacity')
        }
    });

    socket.on('makeMove', (move: Move) => {
        const success = game.makeMove(move);
        if (success) {
            io.to('blokusGame').emit('gameState', {playerId: socket.id, gameState: game.getState()}); // Broadcast updated game state
        } else {
            socket.emit('moveRejected', 'Invalid move');
        }
    });

    socket.on('disconnect', () => {
        game.removePlayer(socket.id);
        console.log(`Player disconnected: ${socket.id}`);
        // Additional logic can be added here to handle player disconnections
    });
});


// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Blokus server is running on http://localhost:${PORT}`);
});
