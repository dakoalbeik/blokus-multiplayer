import * as BlokusClient from "./../../client/src/types/shared/blokus.types";

import { BLOKUS_ALL_PIECES } from "../data/pieces";
import { Piece } from "./piece";
import { v4 as guid } from "uuid";

type GamePlayer = BlokusClient.Player & {
  id: BlokusClient.PlayerId;
  active: boolean;
};

export class BlokusGame {
  private readonly players: GamePlayer[] = [];
  private readonly board: BlokusClient.Board = this.createEmptyBoard();
  private readonly boardSize = 20;
  private readonly _id = guid();
  private availableColors: BlokusClient.Color[] = [
    "red",
    "blue",
    "green",
    "yellow",
  ];

  private status: BlokusClient.GameStatus = "waiting";
  private currentTurn = "" as BlokusClient.Color;

  constructor(private MIN_MAX_PLAYERS: number = 4) {}

  public get id() {
    return this._id;
  }

  // transition(status: BlokusClient.GameStatus) {
  //   const manager: Record<
  //     BlokusClient.GameStatus,
  //     Array<BlokusClient.GameStatus> | "*"
  //   > = {
  //     gameover: [],
  //     interruption: ["gameover", "interruption", "ongoing"],
  //     ongoing: [],
  //     waiting: [],
  //   };
  // }

  public get activePlayers() {
    return this.players.filter((p) => p.active);
  }

  public addPlayer(name: string, clientId: string): GamePlayer | undefined {
    const activePlayersCount = this.activePlayers.length;

    if (activePlayersCount >= this.MIN_MAX_PLAYERS) {
      return undefined;
    }

    const exisitingPlayer = this.players.find((p) => p.id === clientId);

    if (exisitingPlayer) {
      exisitingPlayer.active = true;
      return exisitingPlayer;
    }

    // brand new player to game
    const player: GamePlayer = {
      name,
      active: true,
      id: clientId as BlokusClient.PlayerId,
      pieces: Array.from(BLOKUS_ALL_PIECES),
      color: this.popRandomColor(),
    };

    this.players.push(player);

    if (activePlayersCount === 1) {
      this.currentTurn = player.color; // First player starts
    } else if (activePlayersCount === this.MIN_MAX_PLAYERS) {
      this.status = "ongoing";
    }

    return player;
  }

  removePlayer(id: string): void {
    const index = this.players.findIndex((player) => player.id === id);

    if (index === -1) return;

    const player = this.players[index];
    // if a player leaves while the game is ongoing
    if (this.status === "ongoing") {
      this.status = "interruption";
      player.active = false;
    } else {
      // add colors back in pool
      // TODO: not sure here if this should happen for interuptions as well?
      this.availableColors.push(player.color);
      // remove player
      this.players.splice(index, 1);
    }
  }

  getState(): BlokusClient.GameState {
    const board = this.board;
    const status = this.status;
    const currentTurn = this.currentTurn;
    return {
      status,
      board,
      currentTurn,
      players: this.players.map<BlokusClient.Player>((p) => ({
        color: p.color,
        name: p.name,
        pieces: p.pieces,
      })),
    };
  }

  makeMove(move: BlokusClient.Move): string {
    // Ensure it's the current player's turn
    if (move.color !== this.currentTurn) return "Not your turn";

    const player = this.players.find((player) => player.color === move.color);
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

    if (!this.hasCornerContact(piece, move.position, player.color)) {
      return "Missing corner contact";
    }

    // Move is valid, finalize placement and update turn
    this.placePieceOnBoard(piece, move.position, player.color);
    player.pieces.splice(pieceIndex, 1);
    this.currentTurn = this.getNextPlayerColor();
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
          this.board[y + rowIndex][x + cellIndex] = null;
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
      width: this.board[0].length,
      height: this.board.length,
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
            this.board[adjacent.y][adjacent.x] !== color
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
            this.board[corner.y][corner.x] === color
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
          this.board[y + rowIndex][x + cellIndex] = color;
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

  private createEmptyBoard() {
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

  private getNextPlayerColor(): BlokusClient.Color {
    const index = this.players.findIndex((p) => p.id === this.currentTurn);
    return this.players[(index + 1) % this.players.length].color;
  }
}
