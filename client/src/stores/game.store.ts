import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {GameState, Player} from "@/types/blokus.types";


export const useGameStore = defineStore("game", () => {
  // State
  const gameState = ref<GameState | null>(null)
  const playerId = ref("")

  const currentPlayer = computed<Player | undefined>(() => {
    return gameState.value?.players.find(player => player.id === playerId.value)
  })

  function updateGameState(state: GameState, player_id: string) {
    gameState.value = state;
    playerId.value = player_id;
  }


  return {
    gameState,
    currentPlayer,
    updateGameState,

  };
});
