<template>
  <div class="row wrap gap-2 p-4" style="max-width: 30rem">
    <BlokusPiece v-for="piece in player.pieces" :color="player.color" :piece="piece"/>
  </div>
</template>

<script lang="ts" setup>
import type {Player} from "@/types/blokus.types";
import BlokusPiece from "@/components/BlokusPiece.vue";

defineProps<{ player: Player }>()
</script>
