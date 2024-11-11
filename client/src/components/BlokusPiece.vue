<template>
  <div :id="piece.id" class="piece" @click="handlePieceClick(piece)">
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
import type {Move} from "../types/blokus.types";
import {useGameStore} from "@/stores/game.store";

const props = defineProps<{
  piece: Blokus.Piece;
  color: Blokus.Color;
  cellSize?: number;
}>();

const gameStore = useGameStore()

function handlePieceClick(piece: Blokus.Piece) {
  const move: Move = {pieceId: piece.id, playerId: gameStore.currentPlayer?.id, position: {x: 0, y: 0}}
  gameStore.socket.emit('makeMove', move)
}

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
  width: 2rem;
  height: 2rem;
}

.piece-cell.occupied {
  border: 1px solid #ccc;
}
</style>
