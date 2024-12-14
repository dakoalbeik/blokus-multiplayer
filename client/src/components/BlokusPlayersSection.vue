<template>
  <div
    class="column gap-1"
    style="padding-block: 1rem; align-items: end; position: absolute; top: 1rem; right: 1rem"
  >
    <div v-for="player in players" :key="player.id" class="row gap-2">
      <div v-if="playerWhoHasTurnId === player.id">👉</div>
      <div :class="['player', player.color, { current: playerWhoHasTurnId === player.id }]">
        {{ player.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as Blokus from "../types/shared/blokus.types";
defineProps<{ players: Blokus.Player[]; playerWhoHasTurnId: Blokus.PlayerId }>();
</script>

<style scoped>
.player {
  border-radius: 10rem;
  padding: 0.25rem 0.75rem;
}
.player.current {
  outline: 1px solid white;
}
</style>
