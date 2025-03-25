<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['room_created']);
const name = ref('');

function submit() {
  if (!name.value) {
    return;
  }

  emit('room_created', name.value);
  name.value = '';
}
</script>

<template>
  <form @submit.prevent="submit">
    <input
      v-model.lazy="name"
      class="outline-none bg-gray-300 p-1 w-full"
      placeholder="Create/Join Room"
      data-testid="create-room"
    />
  </form>
</template>
