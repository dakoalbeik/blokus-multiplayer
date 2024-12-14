<template>
  <BlokusGame v-if="gameStore.gameState && gameStore.currentPlayer" />
  <div v-else>
    <BlokusJoinGameForm />
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game.store";
import BlokusGame from "@/components/BlokusGame.vue";
import BlokusJoinGameForm from "@/components/BlokusJoinGameForm.vue";

const gameStore = useGameStore();
</script>
