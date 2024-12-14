<template>
  <div class="row gap-2 p-4" style="overflow-x: auto; width: 100%">
    <BlokusPiece
      v-for="piece in player.pieces"
      :key="piece.id"
      :color="player.color"
      :piece="piece"
      :hidden="piece.id === draggablePieceId"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PieceId, Player } from "@/types/shared/blokus.types";
import BlokusPiece from "@/components/BlokusPiece.vue";

defineProps<{ player: Player; draggablePieceId?: PieceId }>();
</script>
