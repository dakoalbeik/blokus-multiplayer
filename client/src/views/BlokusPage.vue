<template>
  <BlokusGame v-if="gameStore.clientStatus === 'ready'" />
  <div v-else-if="gameStore.clientStatus === 'lobby'">
    <BlokusJoinGameForm />
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game.store";
import BlokusGame from "@/components/BlokusGame.vue";
import BlokusJoinGameForm from "@/components/BlokusJoinGameForm.vue";

const gameStore = useGameStore();
</script>
