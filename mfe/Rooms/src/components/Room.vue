<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ name?: string; selected?: boolean }>();
const emit = defineEmits(['room_selected', 'remove']);
const roomName = computed(() => props.name ?? 'Unknown');
const roomNameStrip = computed(() =>
  (props.name ?? 'Unknown').replace(/\s/g, '_'),
);
</script>

<template>
  <div class="group~room w-full flex place-content-between">
    <div
      @click="emit('room_selected', roomName)"
      class="bg-green-400 pl-2 pr-4 cursor-pointer hover:ml-4 transition-all"
      :class="{ 'ml-2': props.selected }"
      :data-testid="`room-${roomNameStrip}`"
      :aria-selected="props.selected"
    >
      {{ roomName }}
    </div>
    <div
      class="hidden group~room-hover:(flex) items-center justify-center cursor-pointer"
      @click="emit('remove', roomName)"
      :data-testid="`room-${roomNameStrip}-remove`"
    >
      <span class="rounded-full align-center">x</span>
    </div>
  </div>
</template>
