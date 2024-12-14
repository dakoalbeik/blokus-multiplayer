<template>
  <div class="p-4" v-if="gameStore.gameState && gameStore.currentPlayer">
    <h1>Blokus</h1>
    <BlokusPlayersSection
      :players="gameStore.gameState.players"
      :playerWhoHasTurnId="gameStore.gameState.currentTurn"
    />

    <div class="game-area">
      <BlokusBoard :board="gameStore.gameState.board" />
      <BlokusPlayerPieces :player="gameStore.currentPlayer" />
      <BlokusPiece
        v-if="gameStore.draggedPiece"
        :piece="gameStore.draggedPiece.piece"
        :color="gameStore.draggedPiece.color"
        :position="gameStore.draggedPiece.position"
      />
    </div>
    <p v-if="gameStore.error">{{ gameStore.error }}</p>
  </div>
</template>
<script setup lang="ts">
import { useGameStore } from "@/stores/game.store";
import BlokusBoard from "./BlokusBoard.vue";
import BlokusPlayerPieces from "./BlokusPlayerPieces.vue";
import BlokusPiece from "./BlokusPiece.vue";
import BlokusPlayersSection from "./BlokusPlayersSection.vue";

const gameStore = useGameStore();
</script>

<style scoped>
.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
