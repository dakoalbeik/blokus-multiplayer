<template>
  <div class="players-section">
    <div v-for="player in players" :key="player.color" class="column gap-1">
      <div
        :class="['player', player.color, { current: playerWhoHasTurn === player.color }]"
        :title="player.name"
      >
        {{ player.name.slice(0, 2) }}
      </div>
      <div v-if="playerWhoHasTurn === player.color" style="rotate: -90deg">👉</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Blokus from "../types/shared/blokus.types";
defineProps<{ players: Blokus.Player[]; playerWhoHasTurn: Blokus.Color }>();
</script>

<style scoped>
.players-section {
  display: flex;
  gap: 1rem;
  align-items: start;
}
.player {
  border-radius: 10rem;
  aspect-ratio: 1;
  width: 1.5rem;
  display: grid;
  place-items: center;
}
.player.current {
  outline: 1px solid white;
}
</style>
