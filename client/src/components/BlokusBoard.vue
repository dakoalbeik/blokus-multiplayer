<template>
  <div class="board">
    <div v-for="(row, index) in board" :key="index" class="row">
      <BlokusPieceTile v-for="(cell, cellIndex) in row" :key="cellIndex" :color="cell" :occupied="cell !== null"
                       :show-border-when-empty="true"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {GameState} from "@/types/blokus.types";
import BlokusPieceTile from "@/components/BlokusPieceTile.vue";

defineProps<{ board: GameState['board'] }>()
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  border-radius: 0.2rem;
}

.row {
  display: flex;
}
</style>
