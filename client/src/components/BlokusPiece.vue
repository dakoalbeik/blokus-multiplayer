<template>
  <div class="piece" :id="piece.id">
    <div v-for="(row, rowIndex) in piece.shape" :key="rowIndex" class="piece-row">
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :class="['piece-cell', { [color]: cell === 1, occupied: cell === 1 }]"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as Blokus from "../types/blokus.types";

const props = defineProps<{
  piece: Blokus.Piece;
  color: Blokus.Color;
  cellSize?: number;
}>();

// Set default color if not provided
const pieceColor = props.color || "blue";
</script>

<style scoped>
.piece {
  display: flex;
  flex-direction: column;
}

.piece-row {
  display: flex;
}

.piece-cell {
  width: 1rem;
  height: 1rem;
}

.piece-cell.occupied {
  border: 1px solid #ccc;
}
</style>
