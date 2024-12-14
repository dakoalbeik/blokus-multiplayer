import type { GameState, Move, PlayerId } from "./blokus.types";

export type SocketClientError = {
  status: "client-error";
  reason: string;
};

// socketEvents.ts
export interface ServerToClientEvents {
  gameState: (payload: { gameState: GameState }) => void;
}

export interface ClientToServerEvents {
  joinGame: (
    payload: { name: string },
    callback: (
      payload: SocketClientError | { status: "success"; gameState: GameState; playerId: PlayerId },
    ) => void,
  ) => void;
  makeMove: (payload: { move: Move }, callback: (payload?: SocketClientError) => void) => void;
}
