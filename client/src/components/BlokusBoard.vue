<template>
  <div class="board">
    <div v-for="(row, index) in board" :key="index" class="row">
      <div v-for="(cell, cellIndex) in row" :key="cellIndex" :class="['cell', {[cell]: cell !== null}]"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {GameState} from "@/types/blokus.types";

defineProps<{ board: GameState['board'] }>()
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  width: 2rem;
  height: 2rem;
  border: 1px solid grey;
}
</style>
