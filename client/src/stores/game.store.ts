import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type * as Blokus from "@/types/shared/blokus.types";
import { io, Socket } from "socket.io-client";
import { useBlokusDomBoard } from "@/modules/blokus/blokus-board";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/shared/blokus-socket.types";

type DraggedPiece = {
  piece: Blokus.Piece;
  color: Blokus.Color;
  index: number;
  position: Blokus.Position;
};

export const useGameStore = defineStore("game", () => {
  // State
  const error = ref("");
  const gameState = ref<Blokus.GameState | null>(null);
  const playerId = ref("");
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("ws://localhost:3000");
  const draggedPiece = ref<DraggedPiece | null>(null);
  const boardElement = useBlokusDomBoard();

  function setupSocketListeners() {
    socket.connect();

    socket.on("gameState", ({ gameState }: { gameState: Blokus.GameState }) => {
      console.log({ gameState });
      updateGameState(gameState);
    });
  }

  setupSocketListeners();

  const currentPlayer = computed<Blokus.Player | undefined>(() => {
    return gameState.value?.players.find((player) => player.id === playerId.value);
  });

  function getCurrentPlayer() {
    return gameState.value?.players?.find((player) => player.id === playerId.value);
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

    // remove from player hand
    player.pieces.splice(pieceIndex, 1);

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
        playerId: currentPlayer.value.id,
        position: finalPosition,
        rotation: 0,
        flip: 0,
      };

      socket.emit("makeMove", { move }, (clientError) => {
        if (clientError) {
          console.log("makeMove, error:", clientError);
          resetDrag();
        } else {
          draggedPiece.value = null;
        }
      });
    }
  }

  function resetDrag() {
    const piecePayload = draggedPiece.value;

    if (piecePayload === null) return;

    const player = getCurrentPlayer();

    if (player === undefined) {
      throw Error("Missing player");
    }

    // re-add the piece to the user if they didn't place it on the board
    player.pieces.splice(piecePayload.index, 0, piecePayload.piece);
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

  function joinGame(playerName: string) {
    socket.emit("joinGame", { name: playerName }, (response) => {
      if (response.status === "success") {
        playerId.value = response.playerId;
        gameState.value = response.gameState;
      } else {
        error.value = response.reason;
      }
    });
  }

  return {
    socket,
    error,
    gameState,
    currentPlayer,
    draggedPiece,
    boardElement,
    updateGameState,
    joinGame,
    startDragging,
    dropPiece,
    resetDrag,
    updateError,
    updateDraggedPiecePosition,
  };
});
