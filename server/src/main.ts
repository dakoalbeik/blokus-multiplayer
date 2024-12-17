import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./../../client/src/types/shared/blokus-socket.types";
// src/server.ts
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { v4 as guid } from "uuid";

import * as BlokusClient from "../../client/src/types/shared/blokus.types";
import { BlokusGame } from "../models/game";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const __game = new BlokusGame();
const games = [__game];
const foundGame = games[0];

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("joinGame", ({ name, ...lastSession }, joinGameCallback) => {
    const clientId = "playerId" in lastSession ? lastSession.playerId : guid();
    const player = foundGame.addPlayer(name, clientId);
    if (player) {
      // Join a room for the game
      // TODO: make sure to join the right room
      socket.join(foundGame.id);
      const gameState = foundGame.getState();

      joinGameCallback({
        gameState,
        status: "success",
        playerId: player.id,
        assignedColor: player.color,
      });

      // let other players know
      socket.broadcast.to(foundGame.id).emit("gameState", { gameState });

      console.log(`Player joined: ${name}`);
    } else {
      joinGameCallback({
        status: "client-error",
        reason: "Failed to join. Game is at max capacity",
      });
    }
  });

  socket.on("makeMove", ({ move }, makeMoveCallback) => {
    let error = "";
    try {
      error = foundGame.makeMove(move);
    } catch {
      error = "Something went wrong";
    }

    if (error) {
      makeMoveCallback({ status: "client-error", reason: error });
    } else {
      io.to("blokusGame").emit("gameState", {
        gameState: foundGame.getState(),
      });
    }

    makeMoveCallback(undefined);
  });

  socket.on("disconnect", () => {
    foundGame.removePlayer(socket.id);
    socket.broadcast
      .to(foundGame.id)
      .emit("gameState", { gameState: foundGame.getState() });

    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Blokus server is running on http://localhost:${PORT}`);
});
