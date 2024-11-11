<template>
  <div
    :id="piece.id"
    class="piece"
    @mousedown="handlePieceMouseDown($event, piece)"
    :style="{
      left: position?.x + 'px',
      top: position?.y + 'px',
      position: position ? 'absolute' : undefined,
    }"
  >
    <div v-for="(row, rowIndex) in piece.shape" :key="rowIndex" class="piece-row">
      <BlokusPieceTile
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :color="color"
        :occupied="cell === 1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as Blokus from "../types/blokus.types";
import type { Move } from "../types/blokus.types";
import { useGameStore } from "@/stores/game.store";
import BlokusPieceTile from "@/components/BlokusPieceTile.vue";

defineProps<{
  piece: Blokus.Piece;
  color: Blokus.Color;
  cellSize?: number;
  position?: Blokus.Position;
}>();

const gameStore = useGameStore();
let offset: Blokus.Position = { x: 0, y: 0 };

function eventToPosition(event: MouseEvent): Blokus.Position {
  return { x: event.clientX - offset.x, y: event.clientY - offset.y };
}

function handleMouseMove(event: MouseEvent) {
  gameStore.updateDraggedPiecePosition(eventToPosition(event));
}

function handleMouseUp(event: MouseEvent) {
  gameStore.stopDragging(eventToPosition(event));
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}

function handlePieceMouseDown(event: MouseEvent, piece: Blokus.Piece) {
  const div = event.currentTarget! as HTMLDivElement;

  // Calculate the click position inside the div
  const rect = div.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  offset = { x: offsetX, y: offsetY };

  gameStore.startDragging(piece, eventToPosition(event));
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}
</script>

<style scoped>
.piece {
  display: flex;
  flex-direction: column;
}

.piece-row {
  display: flex;
}
</style>
