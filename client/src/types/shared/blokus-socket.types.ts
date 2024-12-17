import type { Color, GameState, Move, PlayerId } from "./blokus.types";

export type SocketClientError = {
  status: "client-error";
  reason: string;
};

// socketEvents.ts
export interface ServerToClientEvents {
  gameState: (payload: { gameState: GameState }) => void;
}

export type LastSessionPayload = { name: string; roomId: string; playerId: string };

export interface ClientToServerEvents {
  joinGame: (
    payload: { name: string } | LastSessionPayload,
    callback: (
      payload:
        | SocketClientError
        | { status: "success"; gameState: GameState; playerId: PlayerId; assignedColor: Color },
    ) => void,
  ) => void;
  makeMove: (payload: { move: Move }, callback: (payload?: SocketClientError) => void) => void;
}
