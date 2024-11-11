<template>
  <div class="board">
    <div v-for="row in board" :key="row[0]" class="row">
      <div v-for="cell in row" :key="cell" class="cell"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{ board: number[][] }>()
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
