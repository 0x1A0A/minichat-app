<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['send']);

const message = ref('');
const row = ref(1);

watch(message, () => {
  const lineCount = message.value.split('\n').length;
  row.value = Math.min(lineCount, 5);
});

function keydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return;
  if (event.shiftKey) {
    return;
  }
  event.preventDefault();
  sendMessage();
}

function sendMessage() {
  if (!message.value) return;
  emit('send', message.value);
  message.value = '';
}
</script>

<template>
  <div class="bg-gray-200 grid grid-cols-[1fr_auto]">
    <textarea
      v-model="message"
      @keydown="keydown"
      class="w-full outline-none resize-none"
      :rows="row"
    ></textarea>
    <button @click="sendMessage">Send</button>
  </div>
</template>
