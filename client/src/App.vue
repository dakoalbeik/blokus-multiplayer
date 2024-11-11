<script lang="ts" setup>
import {RouterView} from "vue-router";
import {io} from "socket.io-client";
import type {GameState} from "@/stores/game.store";
import {useGameStore} from "@/stores/game.store";

const gameStore = useGameStore()
const socket = io('ws://localhost:3000')

socket.connect()

socket.on("gameState", (gameState: GameState) => {
  gameStore.updateGameState(gameState)
})
socket.emit('joinGame', 'dako')
</script>

<template>
  <RouterView/>
</template>

<style>
.red {
  background-color: red;
}

.orange {
  background-color: orange;
}

.yellow {
  background-color: yellow;
}

.green {
  background-color: green;
}
</style>
