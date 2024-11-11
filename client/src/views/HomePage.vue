<template>
  <p v-if="error">{{ error }}</p>
  <div v-if="gameStore?.gameState && gameStore.currentPlayer" class="p-4">
    <h1>Blokus</h1>
    <p>{{ userName }}</p>
    <div class="row">
      <BlokusBoard :board="gameStore.gameState.board" />
      <BlokusPlayerPieces :player="gameStore.currentPlayer" />
      <BlokusPiece
        v-if="gameStore.draggedPiece"
        :piece="gameStore.draggedPiece.piece"
        :color="gameStore.draggedPiece.color"
        :position="gameStore.draggedPiece.position"
      />
    </div>
  </div>
  <div v-else>
    <div style="display: flex; gap: 1rem">
      <button @click="handleJoinBtnClick">Join game</button>
      <input v-model="userName" type="text" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game.store";
import BlokusBoard from "../components/BlokusBoard.vue";
import BlokusPlayerPieces from "../components/BlokusPlayerPieces.vue";
import BlokusPiece from "../components/BlokusPiece.vue";
import { ref } from "vue";
import type * as Blokus from "@/types/blokus.types";

const gameStore = useGameStore();
const error = ref("");
const userName = ref("");

function handleJoinBtnClick() {
  if (userName.value.trim()) {
    gameStore.socket.emit("joinGame", userName.value);
  } else {
    error.value = "Please enter a name";
  }
}

gameStore.socket.connect();

gameStore.socket.on(
  "gameState",
  ({ playerId, gameState }: { playerId: string; gameState: Blokus.GameState }) => {
    console.log({ gameState, playerId });
    gameStore.updateGameState(gameState, playerId);
  },
);

gameStore.socket.on("error", (err) => {
  error.value = err;
});
</script>
