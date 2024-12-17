<template>
  <div class="p-4" v-if="gameStore.gameState && gameStore.currentPlayer">
    <div class="banner" v-if="gameStore.gameState.status !== 'ongoing'">
      <span v-if="gameStore.gameState.status === 'gameover'">Gameover</span>
      <span v-else-if="gameStore.gameState.status === 'interruption'">A player left</span>
      <span v-else-if="gameStore.gameState.status === 'waiting'">Waiting on players...</span>
    </div>
    <header class="row" style="justify-content: space-between; padding-bottom: 1rem">
      <div class="column">
        <h1>Blokus</h1>
      </div>
      <BlokusPlayersSection
        :players="gameStore.gameState.players"
        :playerWhoHasTurn="gameStore.gameState.currentTurn"
      />
    </header>

    <div class="game-area">
      <BlokusBoard :board="gameStore.gameState.board" />
      <BlokusPlayerPieces
        :player="gameStore.currentPlayer"
        :draggablePieceId="gameStore.draggedPiece?.piece.id"
      />
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
.banner {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(1px);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 5;
  display: flex;
  align-items: center;
}

.banner > * {
  background-color: rgb(210, 64, 64);
  width: 100%;
  text-align: center;
  padding-block: 2rem;
  font-size: 2rem;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
