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
import {GameState, useGameStore} from "@/stores/game.store";
import BlokusBoard from '../components/BlokusBoard.vue'
import BlokusPlayerPieces from '../components/BlokusPlayerPieces.vue'
import {io} from "socket.io-client";
import {ref} from "vue";

const socket = io('ws://localhost:3000')

const gameStore = useGameStore()
const error = ref("")
const userName = ref("")

function handleJoinBtnClick() {
  if (userName.value.trim()) {
    socket.emit('joinGame', userName.value)
  } else {
    error.value = "Please enter a name"
  }
}

socket.connect()

socket.on("gameState", ({playerId, gameState, color}: { playerId: string, color: string, gameState: GameState }) => {
  gameStore.updateGameState(gameState, playerId, color)
})

socket.on('error', (err) => {
  error.value = err;
})

</script>
