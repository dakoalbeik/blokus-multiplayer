export type Position = { x: number; y: number };

export type Dimension = { width: number; height: number };

export type Color = "blue" | "yellow" | "red" | "green";

export type BrandedType<T extends number | string, Brand extends string> = T & { __brand: Brand };

export type PlayerId = BrandedType<string, "PlayerId">;

export type PieceId = `p${number}`;

export type Player = {
  id: PlayerId;
  name: string;
  color: Color; // Color assigned to player pieces
  pieces: Piece[];
};

export type Move = {
  playerId: PlayerId;
  pieceId: string;
  position: Position;
  rotation: number;
  flip: number;
};

export type Board = (null | Color)[][];

export type Shape = number[][];

export type GameStatus = "gameover" | "ongoing" | "waiting" | "interruption";

export type GameState = {
  status: GameStatus;
  players: Player[];
  board: Board; // 20x20 grid representing the Blokus board
  currentTurn: PlayerId; // ID of the player whose turn it is
};

export type Piece = {
  id: PieceId;
  shape: Shape; // Shape matrix, for example [[1, 1], [1, 0]] for a 2x2 piece
  rotation?: number;
  flip?: number;
};
