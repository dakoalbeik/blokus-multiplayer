<template>
  <p v-if="error">{{ error }}</p>
  <div v-if="gameStore?.gameState && gameStore.currentPlayer">
    <div class="row">
      <BlokusBoard :board="gameStore.gameState.board"/>
      <BlokusPlayerPieces :player="gameStore.currentPlayer"/>
    </div>
  </div>
  <div v-else>
    <div style="display: flex; gap: 1rem">
      <button @click="handleJoinBtnClick">Join game</button>
      <input v-model="userName" type="text">
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useGameStore} from "@/stores/game.store";
import BlokusBoard from '../components/BlokusBoard.vue'
import BlokusPlayerPieces from '../components/BlokusPlayerPieces.vue'
import {ref} from "vue";
import type {GameState} from "@/types/blokus.types";


const gameStore = useGameStore()
const error = ref("")
const userName = ref("")

function handleJoinBtnClick() {
  if (userName.value.trim()) {
    gameStore.socket.emit('joinGame', userName.value)
  } else {
    error.value = "Please enter a name"
  }
}

gameStore.socket.connect()

gameStore.socket.on("gameState", ({playerId, gameState, color}: {
  playerId: string,
  color: string,
  gameState: GameState
}) => {
  console.log({gameState, playerId})
  gameStore.updateGameState(gameState, playerId, color)
})

gameStore.socket.on('error', (err) => {
  error.value = err;
})

</script>
