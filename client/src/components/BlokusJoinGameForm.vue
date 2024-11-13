<template>
  <div class="column container">
    <h1>Blokus</h1>
    <input v-model="userName" type="text" placeholder="Enter your name" />
    <p v-if="error" class="error">{{ error }}</p>
    <button @click="handleJoinBtnClick">Join game</button>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game.store";
import { ref } from "vue";

const gameStore = useGameStore();
const error = ref("");
const userName = ref("");

function handleJoinBtnClick() {
  if (userName.value.trim()) {
    gameStore.socket.emit("joinGame", userName.value);
  } else {
    error.value = "Please enter a name";
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 20rem;
  max-width: 20rem;
  margin-inline: auto;
}

.container input {
  padding: 0.5rem 0.75rem;
}

.container h1 {
  text-align: center;
}

.container button {
  padding-block: 1rem;
  background-color: yellow;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 0.75rem;
}
</style>
