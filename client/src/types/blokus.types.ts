export type Color = "blue" | "yellow" | "red" | "green";

export type Player = {
  id: string;
  name: string;
  color: string; // Color assigned to player pieces
  pieces: Piece
};

export type Move = {
  playerId: string;
  pieceId: string;
  position: { x: number; y: number };
  rotation: number;
  flip: boolean;
};

export type GameState = {
  players: Player[];
  board: number[][]; // 20x20 grid representing the Blokus board
  currentTurn: string; // ID of the player whose turn it is
};

export type Piece = {
  id: string;
  shape: number[][]; // Shape matrix, for example [[1, 1], [1, 0]] for a 2x2 piece
  rotation?: number;
  flip?: number;
};
