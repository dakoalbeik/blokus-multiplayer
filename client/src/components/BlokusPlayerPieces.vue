<template>
  <div class="row gap-2 p-4" style="overflow-x: auto; width: 100%">
    <BlokusPiece
      v-for="piece in player.pieces"
      :key="piece.id"
      :color="player.color"
      :piece="piece"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Player } from "@/types/shared/blokus.types";
import BlokusPiece from "@/components/BlokusPiece.vue";

defineProps<{ player: Player }>();
</script>
