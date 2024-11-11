<template>
  <BlokusBoard v-if="gameStore?.gameState?.board" :board="gameStore.gameState.board"/>
</template>

<script lang="ts" setup>
import {useGameStore} from "@/stores/game.store";
import BlokusBoard from '../components/BlokusBoard.vue'

const gameStore = useGameStore()
</script>
