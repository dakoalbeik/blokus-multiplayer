import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type * as Blokus from "@/types/shared/blokus.types";
import { io, Socket } from "socket.io-client";
import { useBlokusDomBoard } from "@/modules/blokus/blokus-board";
import type {
  ClientToServerEvents,
  LastSessionPayload,
  ServerToClientEvents,
} from "@/types/shared/blokus-socket.types";

type DraggedPiece = {
  piece: Blokus.Piece;
  color: Blokus.Color;
  index: number;
  position: Blokus.Position;
};

type ClientStatus = "loading" | "ready" | "lobby";

const BLOKUS_LAST_SESSION_KEY = "blokus_last_session";

export const useGameStore = defineStore("game", () => {
  // State
  const error = ref("");
  const clientStatus = ref<ClientStatus>("loading");
  const gameState = ref<Blokus.GameState | null>(null);
  const playerId = ref("" as Blokus.PlayerId);
  const myColor = ref("" as Blokus.Color);
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("ws://localhost:3000");
  const draggedPiece = ref<DraggedPiece | null>(null);
  const boardElement = useBlokusDomBoard();

  function tryPreviousConnection() {
    const lastSession = localStorage.getItem(BLOKUS_LAST_SESSION_KEY);

    if (lastSession) {
      try {
        const sessionData = JSON.parse(lastSession) as LastSessionPayload;
        socketJoinGame(sessionData);
      } catch (error) {
        console.error("Failed to parse session data from localStorage", error);
      }
    } else {
      clientStatus.value = "lobby";
    }
  }

  function setupSocketListeners() {
    socket.connect();

    socket.on("gameState", ({ gameState }: { gameState: Blokus.GameState }) => {
      console.log({ gameState });
      updateGameState(gameState);
    });

    tryPreviousConnection();
  }

  setupSocketListeners();

  const currentPlayer = computed<Blokus.Player | undefined>(() => {
    return gameState.value?.players.find((player) => player.color === myColor.value);
  });

  function getCurrentPlayer() {
    return gameState.value?.players?.find((player) => player.color === myColor.value);
  }

  function startDragging(piece: Blokus.Piece, position: Blokus.Position) {
    // exit function if there's already a piece being dragged
    if (draggedPiece.value) {
      return;
    }

    const pieceIndex = currentPlayer.value?.pieces?.findIndex((p) => p.id === piece.id);
    if (pieceIndex === undefined || pieceIndex === -1) {
      throw Error("Failed to drag piece");
    }

    const player = getCurrentPlayer();
    if (player === undefined) {
      throw Error("Failed to find player for piece");
    }

    draggedPiece.value = { piece, position, color: player.color, index: pieceIndex };
  }

  function updateError(err: string) {
    error.value = err;
  }

  function dropPiece(finalPosition: Blokus.Position) {
    console.log("Piece dropped at: ", { x: finalPosition.x, y: finalPosition.y });

    const piecePayload = draggedPiece.value;

    if (piecePayload === null) return;

    if (currentPlayer.value) {
      const move: Blokus.Move = {
        pieceId: piecePayload.piece.id,
        color: currentPlayer.value.color,
        position: finalPosition,
        rotation: 0,
        flip: 0,
      };

      socket.emit("makeMove", { move }, (clientError) => {
        if (clientError) {
          console.log("makeMove, error:", clientError);
        }
        resetDrag();
      });
    }
  }

  function resetDrag() {
    draggedPiece.value = null;
  }

  function updateDraggedPiecePosition(position: Blokus.Position) {
    if (draggedPiece.value) {
      draggedPiece.value.position = position;
    }
  }

  function updateGameState(state: Blokus.GameState) {
    gameState.value = state;
  }

  /**
   * Resolves a promise with void, or rejects it with a string error
   *
   * @param payload information to be sent through socket.io
   * @returns
   */
  function socketJoinGame(payload: { name: string } | LastSessionPayload): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("joinGame");
      socket.emit("joinGame", payload, (response) => {
        console.log(response);

        if (response.status === "success") {
          playerId.value = response.playerId;
          myColor.value = response.assignedColor;
          gameState.value = response.gameState;
          localStorage.setItem(BLOKUS_LAST_SESSION_KEY, JSON.stringify(payload));
          clientStatus.value = "ready";
          resolve();
        } else {
          reject(response.reason);
        }
      });
    });
  }

  return {
    socket,
    error,
    gameState,
    currentPlayer,
    draggedPiece,
    boardElement,
    clientStatus,
    updateGameState,
    socketJoinGame,
    startDragging,
    dropPiece,
    resetDrag,
    updateError,
    updateDraggedPiecePosition,
  };
});
