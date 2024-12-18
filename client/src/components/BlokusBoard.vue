<template>
  <div id="blokus-board" class="board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
      <BlokusPieceTile
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :color="cell ?? ''"
        :occupied="cell !== null"
        :show-border-when-empty="true"
      >
        <!-- <span style="position: absolute; font-size: 0.5rem">{{ cellIndex }} | {{ rowIndex }}</span> -->
      </BlokusPieceTile>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GameState } from "@/types/shared/blokus.types";
import BlokusPieceTile from "@/components/BlokusPieceTile.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game.store";

defineProps<{ board: GameState["board"] }>();

const gameStore = useGameStore();
const boardOffset = ref({ x: 0, y: 0 }); // Store board offset in the DOM
const boardSize = ref({ width: 0, height: 0 }); // Store board size in the DOM
const numRows = 20; // Number of rows in the Blokus board
const numCols = 20; // Number of columns in the Blokus board

// On mounted, calculate the board's offset and size
onMounted(() => {
  if (gameStore.boardElement.status === "unmounted") {
    gameStore.boardElement.mount();
    updateBoardInfo();
    document.addEventListener("mouseup", handleMouseUp);
  }
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleMouseUp);
});

// Calculate cell size based on board dimensions and number of cells
const cellWidth = computed(() => boardSize.value.width / numCols);
const cellHeight = computed(() => boardSize.value.height / numRows);

function updateBoardInfo() {
  if (gameStore.boardElement.status === "mounted") {
    const { offset, size } = gameStore.boardElement.getPositionInfo();
    boardOffset.value = offset;
    boardSize.value = size;
    document.addEventListener("mouseup", handleMouseUp);
  }
}

function handleMouseUp() {
  const piecePayload = gameStore.draggedPiece;

  if (piecePayload === null) return;

  const { x, y } = piecePayload.position;

  updateBoardInfo();

  // Calculate the board boundaries
  const boardRight = boardOffset.value.x + boardSize.value.width;
  const boardBottom = boardOffset.value.y + boardSize.value.height;

  // Check if the mouse is within board boundaries
  const isWithinBoard =
    x >= boardOffset.value.x && x <= boardRight && y >= boardOffset.value.y && y <= boardBottom;

  if (!isWithinBoard) {
    // If the drop is outside the board, reset the dragged piece
    gameStore.resetDrag();
    return;
  }

  // Get the mouse position relative to the board's top-left corner
  const xOnBoard = x - boardOffset.value.x;
  const yOnBoard = y - boardOffset.value.y;

  // Calculate the grid coordinates
  const gridX = Math.round(xOnBoard / cellWidth.value);
  const gridY = Math.round(yOnBoard / cellHeight.value);

  // Call the store action to place the piece
  gameStore.dropPiece({ x: gridX, y: gridY });
}
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  border-radius: 0.2rem;
  width: 100%;
  aspect-ratio: 1;
  max-width: 40rem;
}

.row {
  display: flex;
  height: calc(100% / 20);
}
</style>
