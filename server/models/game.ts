import * as BlokusClient from "./../../client/src/types/shared/blokus.types";

import { BLOKUS_ALL_PIECES } from "../data/pieces";
import { Piece } from "./piece";

export class BlokusGame {
  private readonly state: BlokusClient.GameState;
  private readonly boardSize = 20;
  private availableColors: BlokusClient.Color[] = [
    "red",
    "blue",
    "green",
    "yellow",
  ];

  constructor() {
    this.state = {
      players: [],
      board: this.createBoard(),
      currentTurn: "" as BlokusClient.PlayerId,
    };
  }

  addPlayer(name: string, socketId: string): boolean {
    if (this.state.players.length < 4) {
      const player: BlokusClient.Player = {
        name,
        id: socketId as BlokusClient.PlayerId,
        pieces: Array.from(BLOKUS_ALL_PIECES),
        color: this.popRandomColor(),
      };
      this.state.players.push(player);
      if (this.state.players.length === 1) {
        this.state.currentTurn = player.id; // First player starts
      }
      return true;
    }

    return false;
  }

  removePlayer(id: string): void {
    const index = this.state.players.findIndex((player) => player.id === id);
    if (index !== -1) {
      const player = this.state.players[index];
      // add colors back in pool
      this.availableColors.push(player.color);
      // remove player
      this.state.players.splice(index, 1);
    }
  }

  getState(): BlokusClient.GameState {
    return this.state;
  }

  makeMove(move: BlokusClient.Move): string {
    // Ensure it's the current player's turn
    if (move.playerId !== this.state.currentTurn) return "Not your turn";

    const player = this.state.players.find(
      (player) => player.id === move.playerId
    );
    if (!player) return "Missing player";

    // Check if the piece ID is valid
    const pieceIndex = player.pieces.findIndex(
      (piece) => piece.id === move.pieceId
    );
    if (pieceIndex === -1) return "Invalid piece id";

    const piece = player.pieces[pieceIndex];

    // Check if the piece fits on the board
    if (!this.fitsOnBoard(piece, move.position))
      return "Piece didn't fit on the board";

    // Check for edge conflicts
    if (!this.hasNoEdgeConflicts(piece, move.position, player.color))
      return "Edge conflict";

    // Temporarily place piece to check for corner contact
    // this.placePieceOnBoard(piece, move.position, player.color);
    if (!this.hasCornerContact(piece, move.position, player.color)) {
      // this.resetPieceOnBoard(piece, move.position); // Undo temporary placement
      return "Missing corner contact";
    }

    // Move is valid, finalize placement and update turn
    this.placePieceOnBoard(piece, move.position, player.color);
    player.pieces.splice(pieceIndex, 1);
    this.state.currentTurn = this.getNextPlayerId();
    return "";
  }

  private resetPieceOnBoard(
    piece: Piece,
    position: BlokusClient.Position
  ): void {
    const { x, y } = position;
    piece.shape.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          this.state.board[y + rowIndex][x + cellIndex] = null;
        }
      })
    );
  }

  private fitsOnBoard(piece: Piece, position: BlokusClient.Position): boolean {
    const { x, y } = position;
    const { width, height } = this.getBoardDimensions();
    return piece.shape.every((row, rowIndex) =>
      row.every(
        (cell, cellIndex) =>
          cell === 0 ||
          (x + cellIndex >= 0 &&
            x + cellIndex < width &&
            y + rowIndex >= 0 &&
            y + rowIndex < height)
      )
    );
  }

  private getBoardDimensions() {
    return {
      width: this.state.board[0].length,
      height: this.state.board.length,
    };
  }

  private hasNoEdgeConflicts(
    piece: Piece,
    position: BlokusClient.Position,
    color: string
  ): boolean {
    const { x, y } = position;
    return piece.shape.every((row, rowIndex) =>
      row.every((cell, cellIndex) => {
        if (cell === 0) return true;

        const boardX = x + cellIndex;
        const boardY = y + rowIndex;

        // Adjacent cells for edge-to-edge conflict check
        const adjacentCells = [
          { x: boardX, y: boardY - 1 }, // Top
          { x: boardX + 1, y: boardY }, // Right
          { x: boardX, y: boardY + 1 }, // Bottom
          { x: boardX - 1, y: boardY }, // Left
        ];

        const { width, height } = this.getBoardDimensions();

        return adjacentCells.every(
          (adjacent) =>
            // if cell position is outside the board then no conflicts
            adjacent.x < 0 ||
            adjacent.x >= width ||
            adjacent.y < 0 ||
            adjacent.y >= height ||
            // if the there is an adjacent, then make sure the color is different
            this.state.board[adjacent.y][adjacent.x] !== color
        );
      })
    );
  }

  private hasCornerContact(
    piece: Piece,
    position: BlokusClient.Position,
    color: string
  ): boolean {
    const { x, y } = position;
    return piece.shape.some((row, rowIndex) =>
      row.some((cell, cellIndex) => {
        if (cell === 0) return false;

        const boardX = x + cellIndex;
        const boardY = y + rowIndex;

        const { width, height } = this.getBoardDimensions();

        const corners = [
          { x: 0, y: 0 },
          { x: width - 1, y: 0 },
          { x: 0, y: height - 1 },
          { x: width - 1, y: height - 1 },
        ];

        // check if the player placed their piece with a tile in one of the corners
        const placedInCorner = corners.some(
          (corner) => corner.x === boardX && corner.y === boardY
        );

        if (placedInCorner) return true;

        // Diagonal cells for corner contact check
        const diagonalCells = [
          { x: boardX - 1, y: boardY - 1 }, // Top-left
          { x: boardX + 1, y: boardY - 1 }, // Top-right
          { x: boardX - 1, y: boardY + 1 }, // Bottom-left
          { x: boardX + 1, y: boardY + 1 }, // Bottom-right
        ];

        return diagonalCells.some(
          (corner) =>
            corner.x >= 0 &&
            corner.x < width &&
            corner.y >= 0 &&
            corner.y < height &&
            this.state.board[corner.y][corner.x] === color
        );
      })
    );
  }

  private placePieceOnBoard(
    piece: Piece,
    position: BlokusClient.Position,
    color: BlokusClient.Color
  ): void {
    const { x, y } = position;
    piece.shape.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (cell === 1) {
          this.state.board[y + rowIndex][x + cellIndex] = color;
        }
      })
    );
  }

  /**
   * Utility function to assign a unique color to each player
   */
  private popRandomColor(): BlokusClient.Color {
    if (this.availableColors.length === 0) {
      throw Error("Failed to assign color. All colors are in use.");
    }

    // Select a random index within the remaining colors
    const randomIndex = Math.floor(Math.random() * this.availableColors.length);
    const color = this.availableColors[randomIndex];

    // Remove the color from the pool to avoid reassigning it
    this.availableColors.splice(randomIndex, 1);

    return color;
  }

  private createBoard() {
    const board = [];
    for (let i = 0; i < this.boardSize; i++) {
      const row = [];
      for (let j = 0; j < this.boardSize; j++) {
        row.push(null);
      }
      board.push(row);
    }
    return board;
  }

  private getNextPlayerId(): BlokusClient.PlayerId {
    const index = this.state.players.findIndex(
      (p) => p.id === this.state.currentTurn
    );
    return this.state.players[(index + 1) % this.state.players.length].id;
  }
}
