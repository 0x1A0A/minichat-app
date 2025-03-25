<script setup lang="ts">
import { ref } from 'vue';
import CreateRoom from './CreateRoom.vue';
import Room from './Room.vue';

const rooms = ref<Set<string>>(new Set());
const selected_room = ref('');

function joinRoom(name: string) {
  selected_room.value = name;

  rooms.value.add(name);
}

function room_selected(name: string) {
  selected_room.value = name;
}

function room_remove(name: string) {
  rooms.value.delete(name);
  if (selected_room.value === name) selected_room.value = '';
}
</script>

<template>
  <div class="bg-gray-100 p-2 grid grid-rows-[auto_1fr] gap-2">
    <CreateRoom @room_created="joinRoom" />
    <div class="flex flex-col gap-1" data-testid="room-container">
      <template v-for="room in rooms">
        <Room
          :name="room"
          :selected="room === selected_room"
          @room_selected="room_selected"
          @remove="room_remove"
        />
      </template>
    </div>
  </div>
</template>
