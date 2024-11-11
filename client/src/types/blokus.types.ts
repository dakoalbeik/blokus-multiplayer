export type Color = "blue" | "yellow" | "red" | "green";

export type Player = {
  id: string;
  name: string;
  color: Color;
  remainingPieces: Piece[]; // Pieces each player has left to place
  placedPieces: Piece[]; // Pieces that the player has already placed
};

export type Piece = {
  id: string;
  shape: number[][]; // Shape matrix, for example [[1, 1], [1, 0]] for a 2x2 piece
};

export type Cell = {
  x: number;
  y: number;
  occupiedBy: string | null; // Stores player id if occupied, null otherwise
};
