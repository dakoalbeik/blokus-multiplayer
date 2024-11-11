<script lang="ts" setup>
import {RouterView} from "vue-router";
</script>

<template>
  <RouterView/>
</template>

<style>
.red {
  background-color: red;
}

.blue {
  background-color: blue;
}

.yellow {
  background-color: yellow;
}

.green {
  background-color: green;
}

.row {
  display: flex;
}

.column {
  display: flex;
  flex-direction: column;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.wrap {
  flex-wrap: wrap;
}

.p-4 {
  padding: 1rem;
}
</style>
