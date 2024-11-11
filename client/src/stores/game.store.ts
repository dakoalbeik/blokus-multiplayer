import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type * as Blokus from "@/types/blokus.types";
import { io } from "socket.io-client";

export const useGameStore = defineStore("game", () => {
  // State
  const gameState = ref<Blokus.GameState | null>(null);
  const playerId = ref("");
  const socket = io("ws://localhost:3000");
  const draggedPiece = ref<{
    piece: Blokus.Piece;
    color: Blokus.Color;
    index: number;
    position: { x: number; y: number };
  } | null>(null);

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

  function stopDragging(finalPosition: Blokus.Position) {
    console.log({ finalPosition });

    // TODO: emit message to socket. If things work out add it to the board
    // otherwise return it to their hand

    // if (gameStore.currentPlayer) {
    //   const move: Move = {
    //     pieceId: piece.id,
    //     playerId: gameStore.currentPlayer?.id,
    //     position: { x: 0, y: 0 },
    //     rotation: 0,
    //     flip: 0,
    //   };
    //   gameStore.socket.emit("makeMove", move);
    // }
    const piecePayload = draggedPiece.value;
    if (piecePayload === null) return;

    const player = getCurrentPlayer();

    if (player === undefined) {
      throw Error("Missing player");
    }

    // readd the piece to the user if they didn't place it on the board
    player.pieces.splice(piecePayload.index, 0, piecePayload.piece);
    draggedPiece.value = null;
  }

  function updateDraggedPiecePosition(position: Blokus.Position) {
    if (draggedPiece.value) {
      draggedPiece.value.position = position;
    }
  }

  function updateGameState(state: Blokus.GameState, player_id: string) {
    gameState.value = state;
    playerId.value = player_id;
  }

  return {
    socket,
    gameState,
    currentPlayer,
    draggedPiece,
    updateGameState,
    startDragging,
    stopDragging,
    updateDraggedPiecePosition,
  };
});
