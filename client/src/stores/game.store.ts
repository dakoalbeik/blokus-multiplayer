import {defineStore} from "pinia";
import {ref} from "vue";

export type Player = {
  id: string;
  name: string;
  color: string; // Color assigned to player pieces
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
export const useGameStore = defineStore("game", () => {
  // State
  const gameState: GameState | null = ref(null)

  function updateGameState(state: GameState) {
    gameState.value = state;
  }

  return {
    gameState,
    updateGameState
  };
});
