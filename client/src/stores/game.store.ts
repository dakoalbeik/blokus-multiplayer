import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {GameState, Player} from "@/types/blokus.types";
import {io} from "socket.io-client";


export const useGameStore = defineStore("game", () => {
  // State
  const gameState = ref<GameState | null>(null)
  const playerId = ref("")
  const socket = io('ws://localhost:3000')


  const currentPlayer = computed<Player | undefined>(() => {
    return gameState.value?.players.find(player => player.id === playerId.value)
  })

  function updateGameState(state: GameState, player_id: string) {
    gameState.value = state;
    playerId.value = player_id;
  }


  return {
    socket,
    gameState,
    currentPlayer,
    updateGameState,

  };
});
