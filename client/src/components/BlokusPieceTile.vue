<template>
  <div
    :style="
      dimension ? { width: dimension.width + 'px', height: dimension.height + 'px' } : undefined
    "
    :class="[
      'piece-cell',
      { [color]: occupied, occupied: occupied, bordered: showBorderWhenEmpty },
    ]"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import type * as Blokus from "../types/shared/blokus.types";

defineProps<{
  color: Blokus.Color | "";
  occupied: boolean;
  showBorderWhenEmpty?: boolean;
  dimension?: Blokus.Dimension;
}>();
</script>

<style scoped>
.piece-cell {
  width: calc(100% / 20);
  height: 100%;
  border-radius: 0.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piece-cell.bordered {
  border: 1px solid grey;
}

.piece-cell.occupied:before {
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  content: "";
  display: block;
  border-radius: inherit;
  --dimension: 55%;
  width: var(--dimension);
  height: var(--dimension);
}

.piece-cell.occupied {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
