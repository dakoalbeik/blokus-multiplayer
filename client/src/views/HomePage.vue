<template>
  <div v-if="gameStore?.gameState && gameStore.currentPlayer" class="p-4">
    <h1>Blokus</h1>
    <BlokusPlayersSection
      :players="gameStore.gameState.players"
      :playerWhoHasTurnId="gameStore.gameState.currentTurn"
    />

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
    <p v-if="gameStore.error">{{ gameStore.error }}</p>
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
import BlokusPlayersSection from "@/components/BlokusPlayersSection.vue";

const gameStore = useGameStore();

gameStore.socket.connect();

gameStore.socket.on("gameState", ({ gameState }: { gameState: Blokus.GameState }) => {
  console.log({ gameState });
  gameStore.updateGameState(gameState);
});

gameStore.socket.on(
  "joinedGame",
  ({ gameState, playerId }: { gameState: Blokus.GameState; playerId: string }) => {
    gameStore.joinGame(playerId);
    gameStore.updateGameState(gameState);
  },
);

gameStore.socket.on("error", (err) => {
  gameStore.updateError(err);
});
</script>
