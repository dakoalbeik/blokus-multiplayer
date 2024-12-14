import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./../../client/src/types/shared/blokus-socket.types";
// src/server.ts
import express from "express";
import { Server } from "socket.io";
import http from "http";

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

const DEFAULT_GAME_NAME = "blokusGame";
const game = new BlokusGame();

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("joinGame", ({ name }, joinGameCallback) => {
    const playerId = game.addPlayer(name, socket.id);
    if (playerId) {
      // Join a room for the game
      socket.join(DEFAULT_GAME_NAME);
      const gameState = game.getState();

      joinGameCallback({ status: "success", playerId, gameState });

      // let other players know
      socket.broadcast.to("blokusGame").emit("gameState", { gameState });

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
      error = game.makeMove(move);
    } catch {
      error = "Something went wrong";
    }

    if (error) {
      makeMoveCallback({ status: "client-error", reason: error });
    } else {
      io.to("blokusGame").emit("gameState", {
        gameState: game.getState(),
      });
    }

    makeMoveCallback(undefined);
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    socket.broadcast
      .to(DEFAULT_GAME_NAME)
      .emit("gameState", { gameState: game.getState() });
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Blokus server is running on http://localhost:${PORT}`);
});
