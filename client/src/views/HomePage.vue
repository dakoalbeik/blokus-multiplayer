<template>
  <p v-if="gameStore.error">{{ gameStore.error }}</p>
  <div v-if="gameStore?.gameState && gameStore.currentPlayer" class="p-4">
    <h1>Blokus</h1>
    <div class="row">
      <div v-for="player in gameStore.gameState.players" :key="player.id" :class="player.color">
        {{ player.name }}
      </div>
    </div>
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
    <BlokusJoinGameForm />
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game.store";
import BlokusBoard from "../components/BlokusBoard.vue";
import BlokusPlayerPieces from "../components/BlokusPlayerPieces.vue";
import BlokusPiece from "../components/BlokusPiece.vue";
import type * as Blokus from "@/types/blokus.types";
import BlokusJoinGameForm from "@/components/BlokusJoinGameForm.vue";

const gameStore = useGameStore();

gameStore.socket.connect();

gameStore.socket.on(
  "gameState",
  ({ playerId, gameState }: { playerId: string; gameState: Blokus.GameState }) => {
    console.log({ gameState, playerId });
    gameStore.updateGameState(gameState, playerId);
  },
);

gameStore.socket.on("error", (err) => {
  gameStore.updateError(err);
});
</script>
